// AppDelegate.swift — windows, menus and the menu-bar item.

import AppKit
import WebKit

/// The handful of strings the native chrome needs, in the same eight languages
/// the app itself speaks. Anything missing falls back to English.
enum Loc {
    static func t(_ key: String, _ lang: String) -> String {
        (table[lang]?[key]) ?? (table["en"]![key]) ?? key
    }

    static let table: [String: [String: String]] = [
        "en": ["open": "Open Study Ledger", "new": "New Entry…", "gadget": "Desktop Gadget",
               "show": "Show Gadget", "hide": "Hide Gadget", "pin": "Pin to Desktop",
               "float": "Float on Top", "today": "Today", "week": "This Week",
               "quit": "Quit Study Ledger", "reveal": "Reveal Data File in Finder",
               "window": "Window", "view": "View", "file": "File", "edit": "Edit", "help": "Help"],
        "zh-Hans": ["open": "打开学习账簿", "new": "新建记录…", "gadget": "桌面小组件",
               "show": "显示小组件", "hide": "隐藏小组件", "pin": "固定到桌面",
               "float": "置于最前", "today": "今天", "week": "本周",
               "quit": "退出学习账簿", "reveal": "在访达中显示数据文件",
               "window": "窗口", "view": "显示", "file": "文件", "edit": "编辑", "help": "帮助"],
        "zh-Hant": ["open": "開啟學習帳簿", "new": "新增紀錄…", "gadget": "桌面小工具",
               "show": "顯示小工具", "hide": "隱藏小工具", "pin": "固定至桌面",
               "float": "置於最前", "today": "今天", "week": "本週",
               "quit": "結束學習帳簿", "reveal": "在 Finder 中顯示資料檔",
               "window": "視窗", "view": "顯示方式", "file": "檔案", "edit": "編輯", "help": "輔助說明"],
        "ja": ["open": "学習台帳を開く", "new": "新規記録…", "gadget": "デスクトップガジェット",
               "show": "ガジェットを表示", "hide": "ガジェットを隠す", "pin": "デスクトップに固定",
               "float": "最前面に表示", "today": "今日", "week": "今週",
               "quit": "学習台帳を終了", "reveal": "データファイルをFinderで表示",
               "window": "ウインドウ", "view": "表示", "file": "ファイル", "edit": "編集", "help": "ヘルプ"],
        "es": ["open": "Abrir Libro de Estudio", "new": "Nueva entrada…", "gadget": "Widget de escritorio",
               "show": "Mostrar widget", "hide": "Ocultar widget", "pin": "Fijar al escritorio",
               "float": "Mantener encima", "today": "Hoy", "week": "Esta semana",
               "quit": "Salir de Libro de Estudio", "reveal": "Mostrar archivo de datos en Finder",
               "window": "Ventana", "view": "Visualización", "file": "Archivo", "edit": "Edición", "help": "Ayuda"],
        "de": ["open": "Studienbuch öffnen", "new": "Neuer Eintrag…", "gadget": "Schreibtisch-Widget",
               "show": "Widget einblenden", "hide": "Widget ausblenden", "pin": "Am Schreibtisch anheften",
               "float": "Immer im Vordergrund", "today": "Heute", "week": "Diese Woche",
               "quit": "Studienbuch beenden", "reveal": "Datendatei im Finder zeigen",
               "window": "Fenster", "view": "Darstellung", "file": "Ablage", "edit": "Bearbeiten", "help": "Hilfe"],
        "fr": ["open": "Ouvrir le Registre d’Étude", "new": "Nouvelle entrée…", "gadget": "Widget de bureau",
               "show": "Afficher le widget", "hide": "Masquer le widget", "pin": "Fixer au bureau",
               "float": "Garder au premier plan", "today": "Aujourd’hui", "week": "Cette semaine",
               "quit": "Quitter le Registre d’Étude", "reveal": "Afficher le fichier de données dans le Finder",
               "window": "Fenêtre", "view": "Présentation", "file": "Fichier", "edit": "Édition", "help": "Aide"],
        "la": ["open": "Codicem Studiorum aperire", "new": "Nova nota…", "gadget": "Instrumentum Mensae",
               "show": "Instrumentum ostendere", "hide": "Instrumentum celare", "pin": "Mensae affigere",
               "float": "Supra omnia", "today": "Hodie", "week": "Hac hebdomade",
               "quit": "Codicem Studiorum finire", "reveal": "Fasciculum datorum in Finder ostendere",
               "window": "Fenestra", "view": "Species", "file": "Fasciculus", "edit": "Recensere", "help": "Auxilium"]
    ]
}

final class AppDelegate: NSObject, NSApplicationDelegate, WebHostDelegate, NSWindowDelegate {

    private var mainWindow: NSWindow!
    private var mainHost: WebHost!
    private var gadget: GadgetPanel?
    private var statusItem: NSStatusItem!
    private var lang: String { LedgerStore.shared.summary.language }

    // MARK: - lifecycle

    func applicationDidFinishLaunching(_ note: Notification) {
        buildMainWindow()
        buildMenu()
        buildStatusItem()
        if GadgetPanel.wasShown { showGadget() }
        refreshChrome()
    }

    func applicationShouldTerminateAfterLastWindowClosed(_ app: NSApplication) -> Bool { false }

    func applicationShouldHandleReopen(_ app: NSApplication, hasVisibleWindows flag: Bool) -> Bool {
        openMain()
        return true
    }

    func applicationWillTerminate(_ note: Notification) {
        gadget?.rememberFrame()
    }

    // MARK: - main window

    private func buildMainWindow() {
        mainHost = WebHost(page: "index.html", injectData: true)
        mainHost.delegate = self

        let frame = NSRect(x: 0, y: 0, width: 1240, height: 840)
        mainWindow = NSWindow(contentRect: frame,
                              styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
                              backing: .buffered, defer: false)
        mainWindow.title = "Study Ledger"
        mainWindow.titlebarAppearsTransparent = true
        mainWindow.titleVisibility = .hidden
        mainWindow.minSize = NSSize(width: 900, height: 560)
        mainWindow.isReleasedWhenClosed = false
        mainWindow.setFrameAutosaveName("LedgerMainWindow")
        mainWindow.delegate = self

        mainHost.webView.frame = mainWindow.contentLayoutRect
        mainHost.webView.autoresizingMask = [.width, .height]
        mainWindow.contentView = mainHost.webView

        mainWindow.center()
        mainWindow.makeKeyAndOrderFront(nil)
    }

    // MARK: - menus

    private func buildMenu() {
        let bar = NSMenu()
        let name = "Study Ledger"

        // Application menu
        let appItem = NSMenuItem()
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "About \(name)", action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: Loc.t("reveal", lang), action: #selector(revealData), keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: "Hide \(name)", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        let others = appMenu.addItem(withTitle: "Hide Others", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        others.keyEquivalentModifierMask = [.command, .option]
        appMenu.addItem(withTitle: "Show All", action: #selector(NSApplication.unhideAllApplications(_:)), keyEquivalent: "")
        appMenu.addItem(.separator())
        appMenu.addItem(withTitle: Loc.t("quit", lang), action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appItem.submenu = appMenu
        bar.addItem(appItem)

        // File
        let fileItem = NSMenuItem()
        let fileMenu = NSMenu(title: Loc.t("file", lang))
        fileMenu.addItem(withTitle: Loc.t("new", lang), action: #selector(newEntry), keyEquivalent: "n")
        fileMenu.addItem(.separator())
        fileMenu.addItem(withTitle: "Close", action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
        fileItem.submenu = fileMenu
        bar.addItem(fileItem)

        // Edit — the standard responders so copy/paste/undo work in the web view
        let editItem = NSMenuItem()
        let editMenu = NSMenu(title: Loc.t("edit", lang))
        editMenu.addItem(withTitle: "Undo", action: Selector(("undo:")), keyEquivalent: "z")
        editMenu.addItem(withTitle: "Redo", action: Selector(("redo:")), keyEquivalent: "Z")
        editMenu.addItem(.separator())
        editMenu.addItem(withTitle: "Cut", action: #selector(NSText.cut(_:)), keyEquivalent: "x")
        editMenu.addItem(withTitle: "Copy", action: #selector(NSText.copy(_:)), keyEquivalent: "c")
        editMenu.addItem(withTitle: "Paste", action: #selector(NSText.paste(_:)), keyEquivalent: "v")
        editMenu.addItem(withTitle: "Select All", action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
        editItem.submenu = editMenu
        bar.addItem(editItem)

        // View — the gadget lives here
        let viewItem = NSMenuItem()
        let viewMenu = NSMenu(title: Loc.t("view", lang))
        let toggle = viewMenu.addItem(withTitle: Loc.t("show", lang), action: #selector(toggleGadget), keyEquivalent: "g")
        toggle.tag = 100
        let pin = viewMenu.addItem(withTitle: Loc.t("pin", lang), action: #selector(pinGadget), keyEquivalent: "")
        pin.tag = 101
        let float = viewMenu.addItem(withTitle: Loc.t("float", lang), action: #selector(floatGadget), keyEquivalent: "")
        float.tag = 102
        viewMenu.addItem(.separator())
        viewMenu.addItem(withTitle: "Enter Full Screen", action: #selector(NSWindow.toggleFullScreen(_:)), keyEquivalent: "f")
        viewItem.submenu = viewMenu
        bar.addItem(viewItem)

        // Window
        let windowItem = NSMenuItem()
        let windowMenu = NSMenu(title: Loc.t("window", lang))
        windowMenu.addItem(withTitle: "Minimize", action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
        windowMenu.addItem(withTitle: "Zoom", action: #selector(NSWindow.performZoom(_:)), keyEquivalent: "")
        windowMenu.addItem(.separator())
        windowMenu.addItem(withTitle: Loc.t("open", lang), action: #selector(openMain), keyEquivalent: "0")
        windowItem.submenu = windowMenu
        bar.addItem(windowItem)

        NSApp.mainMenu = bar
        NSApp.windowsMenu = windowMenu
    }

    /// Keep the gadget items describing what they will actually do.
    private func syncMenuState() {
        guard let view = NSApp.mainMenu?.item(at: 3)?.submenu else { return }
        let shown = gadget?.isVisible ?? false
        view.item(withTag: 100)?.title = Loc.t(shown ? "hide" : "show", lang)
        view.item(withTag: 101)?.state = gadget?.gadgetLevel == .desktop ? .on : .off
        view.item(withTag: 102)?.state = gadget?.gadgetLevel == .floating ? .on : .off
    }

    // MARK: - menu bar item

    private func buildStatusItem() {
        statusItem = NSStatusBar.system.statusItem(withLength: NSStatusItem.variableLength)
        statusItem.button?.image = NSImage(systemSymbolName: "book.closed", accessibilityDescription: "Study Ledger")
        statusItem.button?.imagePosition = .imageLeading

        let menu = NSMenu()
        menu.addItem(withTitle: Loc.t("open", lang), action: #selector(openMain), keyEquivalent: "")
        menu.addItem(withTitle: Loc.t("new", lang), action: #selector(newEntry), keyEquivalent: "")
        menu.addItem(.separator())
        let g = menu.addItem(withTitle: Loc.t("show", lang), action: #selector(toggleGadget), keyEquivalent: "")
        g.tag = 200
        menu.addItem(.separator())
        menu.addItem(withTitle: Loc.t("quit", lang), action: #selector(NSApplication.terminate(_:)), keyEquivalent: "")
        menu.items.forEach { $0.target = self }
        statusItem.menu = menu
    }

    /// Menu bar title, gadget contents and menu labels, after any data change.
    private func refreshChrome() {
        let s = LedgerStore.shared.summary
        statusItem?.button?.title = " " + s.todayLabel
        statusItem?.menu?.item(withTag: 200)?.title = Loc.t(gadget?.isVisible == true ? "hide" : "show", lang)
        syncMenuState()
    }

    // MARK: - actions

    @objc func openMain() {
        NSApp.activate(ignoringOtherApps: true)
        mainWindow.makeKeyAndOrderFront(nil)
    }

    @objc func newEntry() {
        openMain()
        mainHost.run("if (window.App) window.App.newEntry();")
    }

    @objc func revealData() {
        NSWorkspace.shared.activateFileViewerSelecting([LedgerStore.shared.fileURL])
    }

    @objc func toggleGadget() {
        if let g = gadget, g.isVisible {
            g.rememberFrame()
            g.orderOut(nil)
            GadgetPanel.wasShown = false
        } else {
            showGadget()
            GadgetPanel.wasShown = true
        }
        refreshChrome()
    }

    @objc func pinGadget() { gadget?.applyLevel(.desktop); refreshChrome() }
    @objc func floatGadget() { gadget?.applyLevel(.floating); refreshChrome() }

    private func showGadget() {
        if gadget == nil { gadget = GadgetPanel(delegate: self) }
        gadget?.orderFront(nil)
        gadget?.host.refresh(with: LedgerStore.shared.raw)
    }

    // MARK: - WebHostDelegate

    func webHostDidSave(_ host: WebHost) {
        // Whoever did not write it needs to hear about it.
        if host === mainHost { gadget?.host.refresh(with: LedgerStore.shared.raw) }
        else { mainHost.refresh(with: LedgerStore.shared.raw) }
        refreshChrome()
    }

    func webHost(_ host: WebHost, command: String, payload: [String: Any]) {
        switch command {
        case "open-main": openMain()
        case "new-entry": newEntry()
        case "toggle-gadget": toggleGadget()
        case "pin-gadget": pinGadget()
        case "float-gadget": floatGadget()
        default: break
        }
    }

    func webHostDidFinishLoad(_ host: WebHost) {
        if let g = gadget, host === g.host { host.run("document.documentElement.dataset.level = '\(g.gadgetLevel.rawValue)';") }
        refreshChrome()
    }

    // MARK: - NSWindowDelegate

    func windowWillClose(_ note: Notification) {
        // Closing the main window leaves the gadget and menu bar running, which
        // is the point of a desktop fixture.
        gadget?.rememberFrame()
    }
}
