module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "254798",
    DB: "library",
    dialect: "postgres",
    modelsPath: './modelsPostgre/',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};