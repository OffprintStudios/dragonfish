import Foundation
import NanoID
import SwiftSoup

/// Generates an ID based on whether or not an ID was already provided
func generateID(with id: String? = nil) -> String {
    if let hasID = id {
        return hasID
    } else {
        return NanoID.with(size: Int(NANO_ID_SIZE))
    }
}

/// Detects whether or not a user can access something given a set of roles.
func canAccess(needs rolesRequired: [Account.Roles], has rolesPresent: [Account.Roles]) -> Bool {
    let requiredSet = Set(rolesRequired)
    let presentSet = Set(rolesPresent)
    
    return requiredSet.intersection(presentSet).count != 0
}

/// Returns the default whitelist for body HTML. Use in place of `Whitelist.relaxed()`.
func defaultWhitelist() throws -> Whitelist {
    try Whitelist.relaxed()
            .addTags("iframe", "hr", "s")
            .addAttributes("iframe", "width", "height", "allowfullscreen", "src", "start")
            .addAttributes("div", "data-youtube-video", "contenteditable", "draggable", "class")
            .addAttributes("p", "style")
            .addAttributes("span", "style")
            .addAttributes("hr", "contenteditable")
}

/// Returns the word count for an input string.
func countWords(of text: String) throws -> Int64 {
    let cleanedString = try SwiftSoup.clean(text, .none())!
    let wordCount = cleanedString.split { $0.isLetter }.count
    return Int64(wordCount)
}