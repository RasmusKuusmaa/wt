import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import type { RegisterDTO, LoginDTO, RefreshTokenDTO, JWTPayload } from '../types/index.js';
import { Redis } from 'ioredis';

const REFRESH_TOKEN_EXPIRY = 7 * 24 * 60 * 60;

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService();

  fastify.post<{ Body: RegisterDTO }>(
    '/auth/register',
    async (request: FastifyRequest<{ Body: RegisterDTO }>, reply: FastifyReply) => {
      try {
        const user = await authService.register(request.body);

        const accessToken = fastify.jwt.sign(
          { userId: user.id, email: user.email } as JWTPayload,
          { expiresIn: '15m' }
        );

        const refreshToken = fastify.jwt.sign(
          { userId: user.id, email: user.email } as JWTPayload,
          { expiresIn: '7d' }
        );

        const redis = fastify.redis as Redis;
        await redis.setex(`refresh_token:${user.id}`, REFRESH_TOKEN_EXPIRY, refreshToken);

        return reply.status(201).send({
          success: true,
          data: {
            accessToken,
            refreshToken,
            user,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        const message = error instanceof Error ? error.message : 'Failed to register user';
        return reply.status(400).send({
          success: false,
          error: message,
        });
      }
    }
  );

  fastify.post<{ Body: LoginDTO }>(
    '/auth/login',
    async (request: FastifyRequest<{ Body: LoginDTO }>, reply: FastifyReply) => {
      try {
        const user = await authService.login(request.body);

        const accessToken = fastify.jwt.sign(
          { userId: user.id, email: user.email } as JWTPayload,
          { expiresIn: '15m' }
        );

        const refreshToken = fastify.jwt.sign(
          { userId: user.id, email: user.email } as JWTPayload,
          { expiresIn: '7d' }
        );

        const redis = fastify.redis as Redis;
        await redis.setex(`refresh_token:${user.id}`, REFRESH_TOKEN_EXPIRY, refreshToken);

        return reply.send({
          success: true,
          data: {
            accessToken,
            refreshToken,
            user,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(401).send({
          success: false,
          error: 'Invalid email or password',
        });
      }
    }
  );

  fastify.post<{ Body: RefreshTokenDTO }>(
    '/auth/refresh',
    async (request: FastifyRequest<{ Body: RefreshTokenDTO }>, reply: FastifyReply) => {
      try {
        const { refreshToken } = request.body;

        if (!refreshToken) {
          return reply.status(400).send({
            success: false,
            error: 'Refresh token is required',
          });
        }

        const decoded = fastify.jwt.verify<JWTPayload>(refreshToken);

        const redis = fastify.redis as Redis;
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

        if (!storedToken || storedToken !== refreshToken) {
          return reply.status(401).send({
            success: false,
            error: 'Invalid or expired refresh token',
          });
        }

        const user = await authService.getUserById(decoded.userId);
        if (!user) {
          return reply.status(401).send({
            success: false,
            error: 'User not found',
          });
        }

        const newAccessToken = fastify.jwt.sign(
          { userId: user.id, email: user.email } as JWTPayload,
          { expiresIn: '15m' }
        );

        return reply.send({
          success: true,
          data: {
            accessToken: newAccessToken,
            user,
          },
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(401).send({
          success: false,
          error: 'Invalid or expired refresh token',
        });
      }
    }
  );

  fastify.post(
    '/auth/logout',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user!;

        const redis = fastify.redis as Redis;
        await redis.del(`refresh_token:${user.userId}`);

        return reply.send({
          success: true,
          message: 'Logged out successfully',
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to logout',
        });
      }
    }
  );

  fastify.get(
    '/auth/me',
    { onRequest: [fastify.authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const user = request.user!;

        const userInfo = await authService.getUserById(user.userId);

        if (!userInfo) {
          return reply.status(404).send({
            success: false,
            error: 'User not found',
          });
        }

        return reply.send({
          success: true,
          data: userInfo,
        });
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to get user info',
        });
      }
    }
  );
}
