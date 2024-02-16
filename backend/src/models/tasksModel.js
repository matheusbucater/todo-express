const connection = require("./connection");

const getAll = async () => {
    const [tasks] = await connection.execute("SELECT * FROM tasks");
    return tasks;
};

const createTask = async (task) => {
    const {title} = task;
    const [newTask] = await connection.execute("INSERT INTO tasks(title) VALUES (?)", title);

    return newTask;
}

module.exports = {
    getAll,
    createTask
};
