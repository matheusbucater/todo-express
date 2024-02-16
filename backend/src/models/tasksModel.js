const connection = require("./connection");

const getTasks = async () => {
    const [tasks] = await connection.execute("SELECT * FROM tasks");
    return tasks;
};

const createTask = async (task) => {
    const {title} = task;
    const [createdTask] = await connection.execute("INSERT INTO tasks(title) VALUES (?)", [title]);
    return createdTask;
}

const deleteTask = async (id) => {
    const [deletedTask] = await connection.execute("DELETE FROM tasks WHERE id = (?)", [id]);
    return deletedTask;
}

const updateTask = async (id, task) => {
    const {title, status} = task;
    
    if (title === undefined) {
        const [updatedTask] = await connection.execute("UPDATE tasks SET status = (?) WHERE id = (?)", [status, id]);
        return updatedTask;
    }
    if (status === undefined) {
        const [updatedTask] = await connection.execute("UPDATE tasks SET title = (?) WHERE id = (?)", [title, id]);
        return updatedTask;
    }

    const [updatedTask] = await connection.execute("UPDATE tasks SET title = (?), status = (?) WHERE id = (?)", [title, status, id]);
    return updatedTask;
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
};
