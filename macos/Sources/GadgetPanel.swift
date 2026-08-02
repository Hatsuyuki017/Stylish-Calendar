// GadgetPanel.swift — the desktop gadget.
//
// A borderless, non-activating panel that can sit at one of two levels:
//
//   .desktop  pinned among the desktop icons, behind every ordinary window —
//             the classic gadget: visible when you clear your screen, never in
//             the way while you work.
//   .floating above everything, for when you want the timer in sight.
//
// It rides on the same JSON file as the main window, so it is always showing
// the same numbers.

import AppKit

enum GadgetLevel: String {
    case desktop, floating

    var windowLevel: NSWindow.Level {
        switch self {
        case .desktop:  return NSWindow.Level(rawValue: Int(CGWindowLevelForKey(.desktopIconWindow)))
        case .floating: return .floating
        }
    }
}

final class GadgetPanel: NSPanel {
    private static let frameKey = "GadgetFrame"
    private static let levelKey = "GadgetLevel"
    private static let shownKey = "GadgetShown"

    let host: WebHost
    private(set) var gadgetLevel: GadgetLevel

    init(delegate hostDelegate: WebHostDelegate) {
        host = WebHost(page: "gadget.html", injectData: true)
        gadgetLevel = GadgetLevel(rawValue: UserDefaults.standard.string(forKey: GadgetPanel.levelKey) ?? "")
            ?? .floating

        let saved = UserDefaults.standard.string(forKey: GadgetPanel.frameKey)
        let defaultFrame = GadgetPanel.defaultFrame()

        super.init(contentRect: defaultFrame,
                   styleMask: [.borderless, .nonactivatingPanel, .resizable],
                   backing: .buffered,
                   defer: false)

        host.delegate = hostDelegate

        isOpaque = false
        backgroundColor = .clear
        hasShadow = true
        isMovableByWindowBackground = true
        hidesOnDeactivate = false
        becomesKeyOnlyIfNeeded = true
        isFloatingPanel = true
        // Follow the user between Spaces and stay put during Exposé, the way a
        // desktop fixture should.
        collectionBehavior = [.canJoinAllSpaces, .stationary, .ignoresCycle, .fullScreenAuxiliary]
        minSize = NSSize(width: 216, height: 272)
        maxSize = NSSize(width: 460, height: 520)

        let container = NSView(frame: contentRect(forFrameRect: frame))
        container.wantsLayer = true
        container.layer?.cornerRadius = 16
        container.layer?.masksToBounds = true
        container.autoresizingMask = [.width, .height]

        host.webView.frame = container.bounds
        host.webView.autoresizingMask = [.width, .height]
        container.addSubview(host.webView)
        contentView = container

        if let saved, let rect = NSRectFromStringSafe(saved) { setFrame(rect, display: false) }
        applyLevel(gadgetLevel)
    }

    // A borderless panel refuses key status unless it says otherwise; without
    // this the gadget's own buttons would never see a click.
    override var canBecomeKey: Bool { true }

    static func defaultFrame() -> NSRect {
        let screen = NSScreen.main?.visibleFrame ?? NSRect(x: 0, y: 0, width: 1440, height: 900)
        let size = NSSize(width: 272, height: 344)
        return NSRect(x: screen.maxX - size.width - 28,
                      y: screen.maxY - size.height - 28,
                      width: size.width, height: size.height)
    }

    func applyLevel(_ next: GadgetLevel) {
        gadgetLevel = next
        level = next.windowLevel
        UserDefaults.standard.set(next.rawValue, forKey: GadgetPanel.levelKey)
        host.run("document.documentElement.dataset.level = '\(next.rawValue)';")
    }

    func rememberFrame() {
        UserDefaults.standard.set(NSStringFromRect(frame), forKey: GadgetPanel.frameKey)
    }

    static var wasShown: Bool {
        get { UserDefaults.standard.object(forKey: shownKey) as? Bool ?? true }
        set { UserDefaults.standard.set(newValue, forKey: shownKey) }
    }
}

/// NSRectFromString returns a zero rect on garbage; treat that as "no saved
/// frame" rather than parking the gadget in the corner of the screen.
private func NSRectFromStringSafe(_ s: String) -> NSRect? {
    let r = NSRectFromString(s)
    guard r.width > 40, r.height > 40 else { return nil }
    // Only restore it if it still lands on a screen the user actually has.
    let onScreen = NSScreen.screens.contains { $0.visibleFrame.intersects(r) }
    return onScreen ? r : nil
}
