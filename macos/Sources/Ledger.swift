// Ledger.swift — the data file, and the small summary the native chrome needs.
//
// The web app is the only thing that understands the schema. Native owns the
// bytes: it hands the JSON to the web view at startup, writes back whatever the
// web view sends, and reads just enough of it to label the menu bar and draw
// the gadget's fallback state.

import Foundation

/// A day's total, for the menu bar and the gadget.
struct Summary {
    var todayMinutes = 0
    var weekMinutes = 0
    var goalMinutes = 240
    var language = "en"
    var theme = "warm"

    var todayLabel: String { Summary.duration(todayMinutes, language) }
    var weekLabel: String { Summary.duration(weekMinutes, language) }

    /// Mirrors the duration format in js/i18n.js so the menu bar reads the same
    /// as the app it belongs to.
    static func duration(_ mins: Int, _ lang: String) -> String {
        let (h, m) = (mins / 60, mins % 60)
        let unit: (String, String, String, String)   // hour, minute, gap, pad
        switch lang {
        case "zh-Hans": unit = ("小时", "分", "", "")
        case "zh-Hant": unit = ("小時", "分", "", "")
        case "ja":      unit = ("時間", "分", "", "")
        case "de":      unit = ("Std.", "Min.", " ", " ")
        case "es", "fr": unit = ("h", "min", " ", " ")
        default:        unit = ("h", "m", " ", lang == "en" ? "" : " ")
        }
        if mins == 0 { return "0\(unit.3)\(unit.1)" }
        if h == 0 { return "\(m)\(unit.3)\(unit.1)" }
        if m == 0 { return "\(h)\(unit.3)\(unit.0)" }
        return "\(h)\(unit.3)\(unit.0)\(unit.2)\(m)\(unit.3)\(unit.1)"
    }
}

final class LedgerStore {
    static let shared = LedgerStore()

    private let queue = DispatchQueue(label: "app.studyledger.store")
    private(set) var raw: String?
    private(set) var summary = Summary()

    /// ~/Library/Application Support/Study Ledger/ledger.json, unless
    /// LEDGER_DATA_DIR overrides it — which is how the self-test keeps its
    /// hands off real data.
    let fileURL: URL = {
        let dir: URL
        if let override = ProcessInfo.processInfo.environment["LEDGER_DATA_DIR"], !override.isEmpty {
            dir = URL(fileURLWithPath: override, isDirectory: true)
        } else {
            let base = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
            dir = base.appendingPathComponent("Study Ledger", isDirectory: true)
        }
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        return dir.appendingPathComponent("ledger.json")
    }()

    private init() { reload() }

    func reload() {
        raw = try? String(contentsOf: fileURL, encoding: .utf8)
        summary = LedgerStore.summarise(raw)
    }

    /// Write-behind so a burst of edits does not thrash the disk. The web view
    /// is the source of truth; we never rewrite what it sends.
    func write(_ text: String) {
        raw = text
        summary = LedgerStore.summarise(text)
        queue.async { [fileURL] in
            let tmp = fileURL.appendingPathExtension("tmp")
            do {
                try text.write(to: tmp, atomically: false, encoding: .utf8)
                _ = try FileManager.default.replaceItemAt(fileURL, withItemAt: tmp)
            } catch {
                // Last resort: a direct write, so a failed atomic swap does not
                // silently lose the edit.
                try? text.write(to: fileURL, atomically: true, encoding: .utf8)
            }
        }
    }

    // MARK: - reading just enough

    static func summarise(_ text: String?) -> Summary {
        var out = Summary()
        guard let text,
              let data = text.data(using: .utf8),
              let root = (try? JSONSerialization.jsonObject(with: data)) as? [String: Any]
        else { return out }

        if let settings = root["settings"] as? [String: Any] {
            out.language = settings["lang"] as? String ?? "en"
            out.theme = settings["theme"] as? String ?? "warm"
            out.goalMinutes = settings["goal"] as? Int ?? 240
            let weekStart = settings["weekStart"] as? Int ?? 1
            out.weekMinutes = 0
            let entries = root["entries"] as? [[String: Any]] ?? []
            let cal = Calendar.current
            let todayKey = LedgerStore.dayKey(Date())
            let weekKeys = Set(LedgerStore.weekKeys(around: Date(), weekStart: weekStart, calendar: cal))
            for e in entries {
                guard let day = e["day"] as? String,
                      let s = e["start"] as? Int, let f = e["end"] as? Int else { continue }
                let mins = max(0, f - s)
                if day == todayKey { out.todayMinutes += mins }
                if weekKeys.contains(day) { out.weekMinutes += mins }
            }
        }
        return out
    }

    static func dayKey(_ d: Date) -> String {
        let c = Calendar.current.dateComponents([.year, .month, .day], from: d)
        return String(format: "%04d-%02d-%02d", c.year ?? 0, c.month ?? 0, c.day ?? 0)
    }

    /// The seven day keys of the week containing `date`, honouring the app's
    /// own week-start setting rather than the system locale's.
    static func weekKeys(around date: Date, weekStart: Int, calendar: Calendar) -> [String] {
        let weekday = calendar.component(.weekday, from: date) - 1   // 0 = Sunday
        let back = (weekday - weekStart + 7) % 7
        guard let start = calendar.date(byAdding: .day, value: -back, to: date) else { return [] }
        return (0..<7).compactMap { i in
            calendar.date(byAdding: .day, value: i, to: start).map(dayKey)
        }
    }
}
