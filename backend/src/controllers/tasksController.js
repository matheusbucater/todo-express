const tasksModel = require("../models/tasksModel");

const getTasks = async (request, response) => {
    const { id: user_id } = request.data;
    if (request.query.ordered === "true") {
        const tasks = await tasksModel.getOrderedTasks(user_id);
        return response.status(200).json(tasks);
    }
    const tasks = await tasksModel.getTasks(user_id);
    return response.status(200).json(tasks);
};

const createTask = async (request, response) => {
    const { id: user_id } = request.data;
    const newTask = await tasksModel.createTask(request.body, user_id);

    if (newTask.affectedRows === 0) return response.status(400).json({ message: "could not create task" });

    return response.status(201).json({ insertId: newTask.insertId });
}

const deleteTask = async (request, response) => {
    const { id: task_id } = request.params;
    const { id: user_id } = request.data;
    const deletedTask = await tasksModel.deleteTask(task_id, user_id);

    if (deletedTask.affectedRows === 0) return response.status(400).json({ message: "id not found" });

    return response.status(201).json();
}

const updateTask = async (request, response) => {
    const {id: task_id} = request.params;
    const { id: user_id } = request.data;
    const updatedTask = await tasksModel.updateTask(task_id, request.body, user_id);

    if (updatedTask.affectedRows === 0) return response.status(400).json({ message: "id not found" });

    return response.status(201).json();
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
};
