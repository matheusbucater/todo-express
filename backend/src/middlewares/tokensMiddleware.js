const jwt = require("jsonwebtoken");
const env = require("dotenv");

env.config();

const validateUserToken = (request, response, next) => {

    const token = request.get("X-Access-Token");
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return response.status(400).json({ Unathorized: err.message });
        request.data = user;

        next();
    });
}

const generateUserToken = (request, response, next) => {
    const user = request.data;
    jwt.sign(user, process.env.JWT_SECRET, {expiresIn : "1d"}, (err, token) => {
        if (err) return response.status(400).json({ message: "failed to generate token" });
        response.set("X-Access-Token", token);
        next();
     });
}

module.exports = {
    generateUserToken,
    validateUserToken
}
