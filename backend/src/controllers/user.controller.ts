import { FastifyRequest, FastifyReply } from 'fastify';
import userService from '../services/user.service';
import { CreateUserDTO } from '../types/user.types';
import { ApiResponse } from '../types/common.types';
import { logger } from '../utils/logger';

export class UserController {
    async getAllUsers(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const users = await userService.getAllUsers();

            const response: ApiResponse = {
                success: true,
                data: users,
                message: 'Users retrieved successfully'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in getAllUsers controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async register(
        request: FastifyRequest<{ Body: CreateUserDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const userData = request.body;
            const user = await userService.registerUser(userData);

            const response: ApiResponse = {
                success: true,
                data: user,
                message: 'User registered successfully'
            };

            reply.code(201).send(response);
        } catch (error: any) {
            logger.error('Error in register controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }

    async login(
        request: FastifyRequest<{ Body: CreateUserDTO }>,
        reply: FastifyReply
    ): Promise<void> {
        try {
            const credentials = request.body;
            const user = await userService.loginUser(credentials);

            const response: ApiResponse = {
                success: true,
                data: user,
                message: 'Login successful'
            };

            reply.code(200).send(response);
        } catch (error: any) {
            logger.error('Error in login controller:', error);
            reply.code(error.statusCode || 500).send({
                success: false,
                error: error.message || 'Internal server error'
            });
        }
    }
}

export default new UserController();
