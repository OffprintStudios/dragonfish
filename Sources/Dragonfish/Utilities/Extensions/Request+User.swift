import Vapor

struct User {
    var account: Account
    var profile: Profile?
}

struct UserKey: StorageKey {
    typealias Value = User
}

extension Request {
    var user: User? {
        get {
            storage[UserKey.self]
        }
        set {
            storage[UserKey.self] = newValue
        }
    }
}