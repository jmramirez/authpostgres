export default {
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT)  || 3000,
    jwtSecret: process.env.JWT_SECRET || '7231563d1c75ced86ff39ff7bc276b2da977491f43f7d6a074f1a3d19b60b04b',
    jwt_Refresh_Secret: process.env.JWT_REFRESH_SECRET  || '4f43cd0ef639c6bb34342c97186c9435ba1a68694bd49d5746dba1b7f9c85994',
    saltRounds: parseInt(process.env.SALT_W_ROUNDS) || 10,
}