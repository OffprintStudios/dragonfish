import struct Foundation.TimeInterval

/// A long session is effectively 30 days, calculated as Seconds * Minutes * Hours * Days
let LONG_SESSION: TimeInterval = 60.0 * 60.0 * 24.0 * 30.0

/// A short session is effecitvely 1 hour, calculated as Seconds * Minutes * Hours
let SHORT_SESSION: TimeInterval = 60.0 * 60.0 * 1.0

/// A short session is one hour, calculated as Seconds * Minutes * Hours
let TOKEN_EXPIRATION: TimeInterval = 60.0 * 60.0 * 1.0

/// Any account update requires email confirmation with an expiration of 1 hour, calculated as Seconds * Minutes * Hours
let ACCOUNT_UPDATE_EXPIRATION: TimeInterval = 60.0 * 60.0 * 1.0

/// The number of characters for NanoID generation
let NANO_ID_SIZE: Int32 = 10

/// The number of characters for NanoID secure code generation
let NANO_ID_CODE_SIZE: Int32 = 20

/// Sets the maximum number of profiles allowed per-account
let MAX_PROFILE_LIMIT: Int32 = 3

/// A generic error message for things that should be obfuscated by obscurity
let GENERIC_ERROR_MESSAGE: String = "Something went wrong! Try again in a little bit."

/// The minimum word count for works before publishing
let MIN_WORD_COUNT: Int64 = 750