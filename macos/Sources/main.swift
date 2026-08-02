// main.swift — entry point.
//
// `Study Ledger.app --self-test` boots the same web host with no windows on
// screen, exercises the JS bridge end to end, and exits with a status code, so
// the build can be verified without a human watching a window appear.

import AppKit

let app = NSApplication.shared

if CommandLine.arguments.contains("--self-test") {
    app.setActivationPolicy(.prohibited)
    let tester = SelfTest()
    app.delegate = tester
    app.run()
} else {
    let delegate = AppDelegate()
    app.delegate = delegate
    app.setActivationPolicy(.regular)
    app.run()
}
