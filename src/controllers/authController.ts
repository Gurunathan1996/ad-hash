import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { SignupDto, LoginDto } from '../dto/auth.dto';
import { validateDto } from '../utils/validation';
import { ApiException } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';
import { ApiResponse } from '../utils/api-response';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = await validateDto(SignupDto, req.body);
            const user = await this.authService.signup(dto.username, dto.email, dto.password, dto.roleId, dto.companyId);
            res.status(201).send(
                new ApiResponse(201, user, 'User created successfully.'));
        } catch (error) {
            console.log("Signup error:", error);
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = await validateDto(LoginDto, req.body);
            const result = await this.authService.login(dto.username, dto.password);
            res.status(200).send(new ApiResponse(200, result, 'Login successful'));
        } catch (error) {
             console.log("Login error:", error);
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };
}