import { ApiException } from '../error/api-exception';
import { Request, Response, NextFunction } from 'express';

const rbacMiddleware = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.role; // Assuming req.user is set by auth middleware

        if (!userRole) {
            return next(new ApiException(403, 'Access denied'));
        }

        if (roles.includes(userRole)) {
            return next();
        }

        return next(new ApiException(403, 'Access denied'));
    };
};

export default rbacMiddleware;