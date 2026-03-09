import { Request, Response, NextFunction } from 'express';
import { injectable } from 'tsyringe';
import { AuthService } from '../services/auth.service';

@injectable()
export class AuthController {
    constructor(private authService: AuthService) { }

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Registration successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { refreshToken } = req.body;
            const result = await this.authService.refreshTokens(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Tokens refreshed',
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: any, res: Response, next: NextFunction) => {
        try {
            await this.authService.logout(req.user.id);
            res.status(200).json({
                success: true,
                message: 'Logged out successfully',
            });
        } catch (error) {
            next(error);
        }
    }

    getMe = async (req: any, res: Response, next: NextFunction) => {
        try {
            const { password: _, ...user } = req.user;
            res.status(200).json({
                success: true,
                message: 'Profile fetched',
                data: user,
            });
        } catch (error) {
            next(error);
        }
    }
}
