import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const generateTokens = (payload: { userId: string; email: string; role: string }) => {
    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as any,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
    });

    return { accessToken, refreshToken };
};

export const verifyRefreshToken = (token: string) => {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; email: string; role: string };
};
