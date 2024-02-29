const connection = require("./connection");

const getUser = async (email) => {
    const [user] = await connection.execute("SELECT * FROM users WHERE email = (?)", [email]);
    return user[0];
};

const createUser = async (user) => {
    const {username, email, password} = user;
    const [createdTask] = await connection.execute("INSERT INTO users(username, email, password) VALUES (?, ?, ?)", [username, email, password]);
    return createdTask;
};

module.exports = {
    getUser,
    createUser
};
