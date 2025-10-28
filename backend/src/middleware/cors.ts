import { FastifyReply, FastifyRequest } from 'fastify';

export async function corsHandler(request: FastifyRequest, reply: FastifyReply) {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (request.method === 'OPTIONS') {
        reply.status(200).send();
    }
}
