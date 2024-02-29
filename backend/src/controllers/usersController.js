const bcrypt = require("bcrypt");

const usersModel = require("../models/usersModel");

const registerUser = async (request, response) => {
    const {username, email, password} = request.body;
    
    const hashedPassword = await bcrypt.hash(password, 10)
        .catch(() => response.status(400).json({ message: "failed to hash password" }));

    const newUser = {
        username,
        email,
        password: hashedPassword
    };


    const createdUser = await usersModel.createUser(newUser)
        .catch(() => response.status(400).json({ message: "failed to create user" }));
    
    return response.status(200).json(createdUser);
};


module.exports = {
    registerUser,
};
