import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { validateDto } from '../utils/validation';
import { ApiResponse } from '../utils/api-response';
import { ApiException } from '../error/api-exception';
import { UnhandledException } from '../error/unhandled-exception';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = await validateDto(CreateUserDto, req.body);
            const user = await this.userService.createUser(dto.username, dto.email, dto.password, dto.role, dto.companyId);
            const userResponse = {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role?.name,
                companyId: user.companyId,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };
            res.status(201).send(
                new ApiResponse(201, userResponse, 'User created successfully'));
        } catch (error) {
            console.log("error",error);
            
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await this.userService.getUserById(parseInt(req.params.id));
            if (!user) {
                return res.status(404).send(new ApiException(404, 'User not found'));
            }
            res.status(200).send(new ApiResponse(200, user, 'User fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.userService.getAllUsers(page, limit);
            res.status(200).send(new ApiResponse(200, result, 'Users fetched successfully'));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };

    public updateUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const dto = await validateDto(UpdateUserDto, req.body);
            const updatedUser = await this.userService.updateUser(parseInt(req.params.id), dto);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(updatedUser);
        } catch (error) {
            next(error);
        }
    };

    public deleteUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const message = await this.userService.deleteUser(parseInt(req.params.id));
            res.status(200).send(new ApiResponse(200, null, message));
        } catch (error) {
            if (error instanceof ApiException) next(error);
            else next(new UnhandledException(error));
        }
    };
}