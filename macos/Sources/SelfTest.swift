// SelfTest.swift — headless verification of the native shell.
//
// Loads the real web app in an offscreen web view, drives it through the same
// bridge the app uses, and checks the bytes land in the JSON file. Run with
// LEDGER_DATA_DIR pointed at a scratch directory so it never touches real data.

import AppKit
import WebKit

final class SelfTest: NSObject, NSApplicationDelegate, WebHostDelegate {
    private var main: WebHost!
    private var gadget: WebHost!
    private var results: [(String, Bool, String)] = []
    private var mainLoaded = false
    private var gadgetLoaded = false

    private func check(_ label: String, _ pass: Bool, _ extra: String = "") {
        results.append((label, pass, extra))
    }

    func applicationDidFinishLaunching(_ note: Notification) {
        let root = Bundle.main.resourceURL!.appendingPathComponent("web")
        check("web assets are bundled",
              FileManager.default.fileExists(atPath: root.appendingPathComponent("index.html").path))
        check("gadget is bundled",
              FileManager.default.fileExists(atPath: root.appendingPathComponent("gadget.html").path))

        main = WebHost(page: "index.html", injectData: true)
        main.delegate = self
        gadget = WebHost(page: "gadget.html", injectData: true)
        gadget.delegate = self

        // A generous ceiling: if the pages never load, fail loudly rather than hang.
        DispatchQueue.main.asyncAfter(deadline: .now() + 25) { [weak self] in
            guard let self else { return }
            if !self.mainLoaded || !self.gadgetLoaded {
                self.check("pages finished loading", false, "main=\(self.mainLoaded) gadget=\(self.gadgetLoaded)")
                self.finish()
            }
        }
    }

    func webHostDidFinishLoad(_ host: WebHost) {
        if host === main { mainLoaded = true }
        if host === gadget { gadgetLoaded = true }
        guard mainLoaded && gadgetLoaded else { return }
        // Give the app's own boot a beat to run.
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { self.runChecks() }
    }

    func webHostDidSave(_ host: WebHost) {}
    func webHost(_ host: WebHost, command: String, payload: [String: Any]) {
        check("gadget can send a command (\(command))", true)
    }

    private func js(_ host: WebHost, _ code: String, _ done: @escaping (Any?) -> Void) {
        host.webView.evaluateJavaScript(code) { value, error in
            if let error { print("   js error: \(error.localizedDescription)") }
            done(value)
        }
    }

    private func runChecks() {
        js(main, """
        (function () {
          return JSON.stringify({
            store: !!window.Store, i18n: !!window.I18n, fonts: !!window.Fonts,
            app: !!window.App, theme: !!window.Theme,
            native: !!window.LedgerNative,
            isNative: !!(window.Store && window.Store.isNative),
            cats: window.Store ? window.Store.categories().length : -1,
            langs: window.I18n ? window.I18n.LOCALES.length : -1,
            plans: window.Fonts ? Object.keys(window.Fonts.PLANS).length : -1,
            views: document.querySelectorAll('.nav__item').length,
            rendered: document.getElementById('view').innerHTML.length
          });
        })()
        """) { value in
            guard let text = value as? String, let data = text.data(using: .utf8),
                  let d = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] else {
                self.check("main window booted the app", false, "no result")
                self.finish(); return
            }
            self.check("main window booted the app", (d["app"] as? Bool ?? false) && (d["store"] as? Bool ?? false))
            self.check("native bridge is installed", d["native"] as? Bool ?? false)
            self.check("store is using the native file", d["isNative"] as? Bool ?? false)
            self.check("presets seeded", (d["cats"] as? Int ?? 0) == 5, "\(d["cats"] ?? "?")")
            self.check("8 languages available", (d["langs"] as? Int ?? 0) == 8, "\(d["langs"] ?? "?")")
            self.check("4 typographic scripts", (d["plans"] as? Int ?? 0) == 4, "\(d["plans"] ?? "?")")
            self.check("5 views in the sidebar", (d["views"] as? Int ?? 0) == 5, "\(d["views"] ?? "?")")
            self.check("a view actually rendered", (d["rendered"] as? Int ?? 0) > 500, "\(d["rendered"] ?? "?")")
            self.checkRoundTrip()
        }
    }

    /// The important one: an edit in the web view must reach the JSON file.
    private func checkRoundTrip() {
        let marker = "SelfTest-\(Int(Date().timeIntervalSince1970))"
        js(main, """
        (function () {
          var c = Store.categories()[0];
          Store.addItem(c.id, '\(marker)');
          Store.putEntry({ categoryId: c.id, itemName: '\(marker)',
                           activityName: c.activities[0].name, note: '',
                           day: U.key(new Date()), start: 600, end: 750 });
          return String(Store.data.entries.length);
        })()
        """) { _ in
            // The write is queued behind a serial queue; wait for it to land.
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                let onDisk = (try? String(contentsOf: LedgerStore.shared.fileURL, encoding: .utf8)) ?? ""
                self.check("an edit reaches the JSON file", onDisk.contains(marker),
                           "\(onDisk.count) bytes")

                let s = LedgerStore.summarise(onDisk)
                self.check("native reads back today's total", s.todayMinutes >= 150,
                           "\(s.todayMinutes) min")
                self.check("duration formats per language",
                           Summary.duration(150, "en") == "2h 30m" &&
                           Summary.duration(150, "ja") == "2時間30分" &&
                           Summary.duration(150, "de") == "2 Std. 30 Min.",
                           Summary.duration(150, "ja"))
                self.checkGadget()
            }
        }
    }

    private func checkGadget() {
        gadget.refresh(with: LedgerStore.shared.raw)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.6) {
            self.js(self.gadget, """
            (function () {
              return JSON.stringify({
                gadget: !!window.Gadget,
                cells: document.querySelectorAll('.g-cell').length,
                today: (document.querySelector('.g-today__v') || {}).textContent || '',
                rings: document.querySelectorAll('.g-ring').length
              });
            })()
            """) { value in
                if let text = value as? String, let data = text.data(using: .utf8),
                   let d = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any] {
                    self.check("gadget booted", d["gadget"] as? Bool ?? false)
                    self.check("gadget drew its heatmap strip", (d["cells"] as? Int ?? 0) >= 70,
                               "\(d["cells"] ?? "?")")
                    self.check("gadget drew the goal ring", (d["rings"] as? Int ?? 0) >= 1)
                    self.check("gadget shows today's total",
                               !((d["today"] as? String ?? "").isEmpty), "\(d["today"] ?? "")")
                } else {
                    self.check("gadget booted", false, "no result")
                }
                self.finish()
            }
        }
    }

    private func finish() {
        let failed = results.filter { !$0.1 }
        for (label, pass, extra) in results {
            print("  \(pass ? "ok  " : "FAIL") \(label)\(extra.isEmpty ? "" : "  → \(extra)")")
        }
        print("\n\(results.count - failed.count)/\(results.count) native checks passed")
        exit(failed.isEmpty ? 0 : 1)
    }
}
