import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { BodyValidationMiddleware } from '../middleware/validationMiddleware';
import { SignupDto, LoginDto } from '../dto/auth.dto';

const router = Router();
const authController = new AuthController();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password, roleId]
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john.doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "password123"
 *               roleId:
 *                 type: number
 *                 example: 1
 *                 description: "1=SUPER_ADMIN, 2=COMPANY_USER, 3=CUSTOMER"
 *               companyId:
 *                 type: integer
 *                 example: 1
 *                 description: "Required for COMPANY_USER role"
 *           example:
 *             username: "john.doe"
 *             email: "john.doe@example.com"
 *             password: "password123"
 *             roleId: 3
 *             companyId: 1
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User created successfully"
 *               user:
 *                 id: 1
 *                 username: "john.doe"
 *                 roleId: 3
 *                 companyId: 1
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Validation failed"
 *               errors: ["Username is required", "Password must be at least 6 characters"]
 *       409:
 *         description: User already exists
 *         content:
 *           application/json:
 *             example:
 *               message: "User with this username already exists"
 */
router.post('/signup', BodyValidationMiddleware(SignupDto), authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john.doe"
 *               password:
 *                 type: string
 *                 example: "password123"
 *           example:
 *             username: "john.doe"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *               user:
 *                 id: 1
 *                 username: "john.doe"
 *                 role: "CUSTOMER"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             example:
 *               message: "Invalid credentials"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: "Username and password are required"
 */
router.post('/login', BodyValidationMiddleware(LoginDto), authController.login);

export default router;