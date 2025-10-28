import { ResultSetHeader } from 'mysql2';
import database from '../config/database';
import { UserRow, CreateUserDTO } from '../types/user.types';
import { AppError } from '../types/common.types';

export class UserModel {
    private pool = database.getPool();

    async findAll(): Promise<UserRow[]> {
        try {
            const [rows] = await this.pool.query<UserRow[]>(
                'SELECT user_id, user_name as username, password FROM users'
            );
            return rows;
        } catch (error) {
            throw new AppError(500, 'Error fetching users from database');
        }
    }

    async findByUsername(username: string): Promise<UserRow | null> {
        try {
            const [rows] = await this.pool.query<UserRow[]>(
                'SELECT user_id, user_name as username, password FROM users WHERE user_name = ?',
                [username]
            );
            return rows[0] || null;
        } catch (error) {
            throw new AppError(500, 'Error fetching user from database');
        }
    }

    async create(userData: CreateUserDTO): Promise<number> {
        try {
            const [result] = await this.pool.query<ResultSetHeader>(
                'INSERT INTO users (user_name, password) VALUES (?, ?)',
                [userData.username, userData.password]
            );
            return result.insertId;
        } catch (error: any) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new AppError(409, 'Username already exists');
            }
            throw new AppError(500, 'Error creating user');
        }
    }
}

export default new UserModel();
