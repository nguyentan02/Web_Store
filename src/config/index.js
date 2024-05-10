const config = {
    app: {
        port: process.env.PORT || 5050,
    },
    jwt: {
        jwt_secret: process.env.JWT_SECRET
    },

};
module.exports = config;