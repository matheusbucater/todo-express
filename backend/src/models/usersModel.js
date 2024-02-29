const connection = require("./connection");

const createUser = async (user) => {
    const {username, email, password} = user;
    const [createdTask] = await connection.execute("INSERT INTO users(username, email, password) VALUES (?, ?, ?)", [username, email, password]);
    return createdTask;
};

module.exports = {
    createUser
};
