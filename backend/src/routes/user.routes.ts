import { FastifyInstance } from 'fastify';
import userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

async function userRoutes(fastify: FastifyInstance) {
    // Get all users (protected route)
    fastify.get('/users', { preHandler: authenticate }, userController.getAllUsers.bind(userController));

    // Register new user (public route)
    fastify.post('/register', userController.register.bind(userController));

    // Login user (public route)
    fastify.post('/login', userController.login.bind(userController));
}

export default userRoutes;
