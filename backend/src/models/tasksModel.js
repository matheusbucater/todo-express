const connection = require("./connection");

const getTasks = async (user_id) => {
    const [tasks] = await connection.execute("SELECT * FROM tasks WHERE user_id = (?)", [user_id]);
    return tasks;
};

const getOrderedTasks = async (user_id) => {
    const [tasks] = await connection.execute("SELECT * FROM tasks WHERE user_id = (?) ORDER BY status ASC, created_at DESC", [user_id]);
    return tasks;
};

const createTask = async (task, user_id) => {
    const {title} = task;
    const [createdTask] = await connection.execute("INSERT INTO tasks(title, user_id) VALUES (?, ?)", [title, user_id]);
    return createdTask;
}

const deleteTask = async (task_id, user_id) => {
    const [deletedTask] = await connection.execute("DELETE FROM tasks WHERE id = (?) AND user_id = (?)", [task_id, user_id]);
    return deletedTask;
}

const updateTask = async (task_id, task, user_id) => {
    const {title, status} = task;

    if (title === undefined) {
        const [updatedTask] = await connection.execute("UPDATE tasks SET status = (?) WHERE id = (?) AND user_id = (?)", [status, task_id, user_id]);
        return updatedTask;
    }
    if (status === undefined) {
        const [updatedTask] = await connection.execute("UPDATE tasks SET title = (?) WHERE id = (?) AND user_id = (?)", [title, task_id, user_id]);
        return updatedTask;
    }

    const [updatedTask] = await connection.execute("UPDATE tasks SET title = (?), status = (?) WHERE id = (?) AND user_id = (?)", [title, status, task_id, user_id]);
    return updatedTask;
}

module.exports = {
    getTasks,
    getOrderedTasks,
    createTask,
    deleteTask,
    updateTask
};
