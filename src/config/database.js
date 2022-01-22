module.exports = {
    development: {
        username: process.env.DB_USERNAME || 'jmramirez',
        password: process.env.DB_PASSWORD || 'devapplication',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        database: process.env.DB_DATABASE || 'sequelize_dev',
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