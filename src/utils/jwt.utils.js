import jwt from 'jsonwebtoken'
import environment from "../config/environment";

export default class JWTUtils {
    static generateAccessToken(payload, options = {}) {
        const { expiresIn = '1d'} = options
        return jwt.sign(payload, environment.jwtSecret, {expiresIn})
    }

    static generateRefreshToken(payload) {
        return jwt.sign(payload, environment.jwt_Refresh_Secret)
    }

    static verifyAccessToken(accessToken) {
        return jwt.verify(accessToken, environment.jwtSecret)
    }

    static verifyRefreshToken(accessToken) {
        return jwt.verify(accessToken, environment.jwt_Refresh_Secret)
    }
}