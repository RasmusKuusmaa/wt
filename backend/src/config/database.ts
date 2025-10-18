import prisma from './prisma.js';

export const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('Database connected successfully (Prisma)');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default prisma;