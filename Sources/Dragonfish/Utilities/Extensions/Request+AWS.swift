import Vapor
import SotoS3

extension Request {
    var aws: AWS {
        .init(request: self)
    }
    
    struct AWS {
        let request: Request
        
        var client: AWSClient {
            request.application.aws.client
        }
    }
}