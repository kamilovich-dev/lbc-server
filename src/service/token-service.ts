import jwt from 'jsonwebtoken'
import { refresh_token as RefreshTokenModel } from 'models/refresh_token'
import ApiError from 'exceptions/api-error'

export const refreshTokenExpires = 1000 * 60 * 60 * 24 * 30 //30 дней
export const accessTokenExpires = 1000 * 60 * 60 * 24 //1 день

class TokenService {

    generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, process.env.SECRET!, {expiresIn: `${accessTokenExpires}ms`} );
        const refreshToken = jwt.sign(payload, process.env.SECRET!, {expiresIn: `${refreshTokenExpires}ms`} );
        return {
            accessToken,
            refreshToken
        }
    }

    validateAccessToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.SECRET!);
            return userData;
        } catch(e) {
            return null;
        }
    }

    validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, process.env.SECRET!);
            return userData;
        } catch(e) {
            return null;
        }
    }

    async saveToken(userId: number, refreshToken: string) {
        const tokens = await RefreshTokenModel.findAll({ where: { user_id: userId } });
        if (tokens.length >= 5) {
            for (let token of tokens) {
                await RefreshTokenModel.destroy({where: { token: token.token }})
            }
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
