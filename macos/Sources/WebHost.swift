// WebHost.swift — the WKWebView that runs the ledger, and its bridge to Swift.
//
// The pages are served over a custom `ledger://` scheme rather than file://,
// which gives them a real, stable origin. Storage does not ride on that origin
// though: js/store.js talks to `window.LedgerNative`, so the bytes live in a
// JSON file Swift owns and every window sees the same data.

import AppKit
import WebKit

/// Serves the bundled web app. Everything is local; nothing is ever fetched.
final class BundleSchemeHandler: NSObject, WKURLSchemeHandler {
    private let root: URL

    init(root: URL) { self.root = root }

    private static let types: [String: String] = [
        "html": "text/html; charset=utf-8",
        "css": "text/css; charset=utf-8",
        "js": "text/javascript; charset=utf-8",
        "json": "application/json; charset=utf-8",
        "svg": "image/svg+xml",
        "png": "image/png",
        "woff2": "font/woff2"
    ]

    func webView(_ webView: WKWebView, start task: WKURLSchemeTask) {
        guard let url = task.request.url else { return }
        var path = url.path
        if path.isEmpty || path == "/" { path = "/index.html" }

        // Resolve inside the bundle and refuse anything that escapes it.
        let target = root.appendingPathComponent(path).standardizedFileURL
        guard target.path.hasPrefix(root.standardizedFileURL.path),
              let data = try? Data(contentsOf: target) else {
            task.didFailWithError(NSError(domain: NSURLErrorDomain, code: NSURLErrorFileDoesNotExist))
            return
        }

        let mime = BundleSchemeHandler.types[target.pathExtension.lowercased()] ?? "application/octet-stream"
        let response = HTTPURLResponse(url: url, statusCode: 200, httpVersion: "HTTP/1.1", headerFields: [
            "Content-Type": mime,
            "Content-Length": String(data.count),
            "Cache-Control": "no-cache"
        ])!
        task.didReceive(response)
        task.didReceive(data)
        task.didFinish()
    }

    func webView(_ webView: WKWebView, stop task: WKURLSchemeTask) {}
}

protocol WebHostDelegate: AnyObject {
    func webHostDidSave(_ host: WebHost)
    func webHost(_ host: WebHost, command: String, payload: [String: Any])
    func webHostDidFinishLoad(_ host: WebHost)
}

final class WebHost: NSObject, WKScriptMessageHandler, WKNavigationDelegate {
    let webView: WKWebView
    weak var delegate: WebHostDelegate?

    /// - Parameter page: which file under the web root to open.
    init(page: String, injectData: Bool) {
        let root = Bundle.main.resourceURL!.appendingPathComponent("web", isDirectory: true)

        let config = WKWebViewConfiguration()
        config.setURLSchemeHandler(BundleSchemeHandler(root: root), forURLScheme: "ledger")
        config.websiteDataStore = .default()

        // The bridge is installed before any of the app's own scripts run, so
        // store.js finds it already in place on first read.
        let data = injectData ? (LedgerStore.shared.raw ?? "null") : "null"
        let json = data == "null" ? "null" : WebHost.jsString(data)
        let bootstrap = """
        window.LedgerNative = {
          platform: 'macos',
          initialData: \(json),
          save: function (text) {
            window.webkit.messageHandlers.ledger.postMessage({ type: 'save', data: text });
          },
          send: function (command, payload) {
            window.webkit.messageHandlers.ledger.postMessage({
              type: 'command', command: command, payload: payload || {}
            });
          }
        };
        """
        config.userContentController.addUserScript(
            WKUserScript(source: bootstrap, injectionTime: .atDocumentStart, forMainFrameOnly: true))

        webView = WKWebView(frame: .zero, configuration: config)
        webView.setValue(false, forKey: "drawsBackground")   // let the panel's own fill show
        super.init()

        config.userContentController.add(self, name: "ledger")
        webView.navigationDelegate = self
        if #available(macOS 13.3, *) { webView.isInspectable = true }

        webView.load(URLRequest(url: URL(string: "ledger://app/\(page)")!))
    }

    /// Escape a Swift string into a JavaScript string literal.
    static func jsString(_ s: String) -> String {
        let data = try? JSONSerialization.data(withJSONObject: [s], options: [])
        guard let data, var out = String(data: data, encoding: .utf8) else { return "\"\"" }
        out.removeFirst()            // drop the wrapping [ ]
        out.removeLast()
        return out
    }

    func run(_ js: String) {
        webView.evaluateJavaScript(js, completionHandler: nil)
    }

    /// Push freshly written data into this view and let it repaint.
    func refresh(with raw: String?) {
        guard let raw else { return }
        run("""
        if (window.LedgerNative) { window.LedgerNative.initialData = \(WebHost.jsString(raw)); }
        if (window.Store && window.Store.reload) { window.Store.reload(); }
        if (window.Gadget && window.Gadget.render) { window.Gadget.render(); }
        else if (window.App && window.App.render) { window.App.render(); }
        """)
    }

    // MARK: - WKScriptMessageHandler

    func userContentController(_ controller: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let body = message.body as? [String: Any], let type = body["type"] as? String else { return }
        switch type {
        case "save":
            if let text = body["data"] as? String {
                LedgerStore.shared.write(text)
                delegate?.webHostDidSave(self)
            }
        case "command":
            let command = body["command"] as? String ?? ""
            delegate?.webHost(self, command: command, payload: body["payload"] as? [String: Any] ?? [:])
        default:
            break
        }
    }

    // MARK: - WKNavigationDelegate

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        delegate?.webHostDidFinishLoad(self)
    }

    /// Keep everything in-app except links the user explicitly follows outward.
    func webView(_ webView: WKWebView,
                 decidePolicyFor action: WKNavigationAction,
                 decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        if let url = action.request.url, url.scheme == "http" || url.scheme == "https" {
            NSWorkspace.shared.open(url)
            decisionHandler(.cancel)
            return
        }
        decisionHandler(.allow)
    }
}
