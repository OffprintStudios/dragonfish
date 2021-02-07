import { JwtPayload } from '@dragonfish/models/auth';
import { User, FrontendUser, CreateUser, AuditSession } from '@dragonfish/models/users';

/**
 * ## The Authorization Interface
 *
 * Implement this interface to be able to serve data to associated routes.
 */
export interface IAuth {
    /**
     * Validates the incoming email and password of a login request. Returns a User
     * if validation success, but otherwise errors out.
     *
     * @param email A potential user's email
     * @param password A potential user's password
     */
    validateUser(email: string, password: string): Promise<User>;

    /**
     * Registers a new user, then logs them in.
     *
     * @param req The request object
     * @param newUser The new user's credentials
     * @returns
     */
    register(req: any, newUser: CreateUser): Promise<FrontendUser>;

    /**
     * Logs a user in by generating a JWT payload and (if requested) setting the httpOnly refresh token
     * in the request cookies header. Then, constructs a specialized FrontendUser object
     * to send to the frontend.
     *
     * @param user The incoming user
     * @param req The incoming login request
     * @param sessionId (Optional) A new session ID. If included, sessionExpiry must also be included.
     * If included, will set a 'refreshToken' httpOnly cookie.
     * Otherwise, the cookie will not be set, and the user's session will only last an hour.
     * @param sessionExpiry (Optional) Must be included if sessionId is passed. The expiry date of the user's session.
     */
    login(user: User, req: any, sessionId?: string, sessionExpiry?: Date): Promise<FrontendUser>;

    /**
     * Logs a user out by deleting their HTTP-only refresh token cookie. The rest of the logout process
     * takes place in the user service, or client-side.
     *
     * @param req The incoming logout request
     */
    logout(req: any): void;

    /**
     * Refreshes the login of a given user by generating a new JWT payload and reconstructing
     * the FrontendUser object of the requisite user.
     *
     * @param user A user's JWT payload
     */
    refreshLogin(user: JwtPayload): Promise<string>;

    /**
     * Adds a Session ID from a new refresh token to a user's active sessions.
     *
     * @param userId The user's ID
     * @param sessionId The new session ID to add
     * @returns
     */
    addRefreshToken(userId: string, sessionId: string): Promise<AuditSession>;

    /**
     * Checks to see if the refresh token with the provided session ID is valid.
     *
     * @param userId The user's ID
     * @param sessionId The session to check
     * @returns
     */
    checkRefreshToken(userId: string, sessionId: string): Promise<boolean>;

    /**
     * Clears the specified session ID from a user's session list.
     *
     * @param userId The user's ID
     * @param oldSessionId Their old session ID
     * @returns
     */
    clearRefreshToken(userId: string, oldSessionId: string): Promise<void>;
}
