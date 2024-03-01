const bcrypt = require("bcrypt");

const usersModel = require("../models/usersModel");

const validateUserBody = (request, response, next) => {
    const {body} = request;

    if (body.username === undefined | body.username === "") return response.status(400).json({ message: "username field is required" });
    if (body.email === undefined | body.email === "") return response.status(400).json({ message: "email field is required" });
    if (body.password === undefined | body.password === "") return response.status(400).json({ message: "password field is required" });
    
    next();
};

const validateUserCredentials = async (request, response, next) => {
    const {body} = request;

    const user = await usersModel.getUser(body.email)
    if (!user) return response.status(400).json({ message: "failed to fetch user" });

    bcrypt.compare(body.password, user.password, (err, result) => {
        if (err) return response.status(400).json({ message: "failed to validate user" });
        if (!result) return response.status(400).json({ message: "wrong password" });
    });

    request.data = { ...user, password: undefined }; 

    next();
}

module.exports = {
    validateUserBody,
    validateUserCredentials
};
