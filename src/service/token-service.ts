import jwt from 'jsonwebtoken'
import { refresh_token as RefreshTokenModel } from 'models/refresh_token'
import ApiError from 'exceptions/api-error'

class TokenService {

    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, {expiresIn: '24h'} );
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {expiresIn: '120h'} );
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
            return userData;
        } catch(e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
            return userData;
        } catch(e) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const token = await RefreshTokenModel.findOne({ where: { user_id: userId } });
        if (token) {
            token.token = refreshToken;
            await token.save();
            return;
        }
        const new_token = await RefreshTokenModel.create({user_id: userId, token: refreshToken});
        await new_token.save();
    }

    async removeToken(refreshToken: string) {
        await RefreshTokenModel.destroy({ where: { token: refreshToken } });
    }

    async findToken(refreshToken: string) {
        const tokenData = await RefreshTokenModel.findOne({ where: { token: refreshToken}, raw: true });
        return tokenData;
    }
}

export default new TokenService();
