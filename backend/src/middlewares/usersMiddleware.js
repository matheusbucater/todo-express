const bcrypt = require("bcrypt");

const usersModel = require("../models/usersModel");

const validateLoginBody = (request, response, next) => {
    const {body} = request;

    if (body.email === undefined | body.email === "") return response.status(400).json({ message: "email field is required" });
    if (body.password === undefined | body.password === "") return response.status(400).json({ message: "password field is required" });
    
    next();
};

const validateRegisterBody = (request, response, next) => {
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

    await bcrypt.compare(body.password, user.password)
        .then((match) => {
            if (!match) return response.status(400).json({ message: "wrong password" });
        })
        .catch(() => { return response.status(400).json({ message: "failed to compare passwords" }) });

    request.data = { ...user, password: undefined }; 

    next();
}

module.exports = {
    validateLoginBody,
    validateRegisterBody,
    validateUserCredentials
};
