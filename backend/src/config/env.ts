const config = {
    get port() {
        return Number(process.env.PORT) || 5020;
    },
    get nodeEnv() {
        return process.env.NODE_ENV || 'development';
    },
    get db() {
        return {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            name: process.env.DB_NAME || 'codetracker',
            connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10
        };
    }
};

export default config;
