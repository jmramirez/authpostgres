module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'posgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5433,
        database: process.env.DB_DATABASE || 'postgres',
        dialect: 'postgres'
    },
    test: {
        username: process.env.DB_TEST_USERNAME || 'postgres',
        password: process.env.DB_TEST_PASSWORD || 'posgres',
        host: process.env.DB_TEST_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5434,
        database: process.env.DB_TEST_DATABASE || 'postgres',
        dialect: 'postgres'
    }
}