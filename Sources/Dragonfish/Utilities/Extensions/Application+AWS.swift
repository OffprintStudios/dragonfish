import Vapor
import SotoS3

extension Application {
    var aws: AWS {
        .init(application: self)
    }

    struct AWS {
        public let application: Application
        struct ClientKey: StorageKey {
            typealias Value = AWSClient
        }
        public var client: AWSClient {
            get {
                guard let client = self.application.storage[ClientKey.self] else {
                    fatalError("Bucket client not configured. Use application.aws.client = ...")
                }
                return client
            }
            nonmutating set {
                self.application.storage.set(ClientKey.self, to: newValue) {
                    try $0.syncShutdown()
                }
            }
        }
    }
}