const tasksModel = require("../models/tasksModel");

const getTasks = async (request, response) => {
    if (request.query.ordered === "true") {
        const tasks = await tasksModel.getOrderedTasks();
        return response.status(200).json(tasks);
    }
    const tasks = await tasksModel.getTasks();
    return response.status(200).json(tasks);
};

const createTask = async (request, response) => {
    const newTask = await tasksModel.createTask(request.body);

    if (newTask.affectedRows === 0) return response.status(400).json({ message: "could not create task" });

    return response.status(201).json({ insertId: newTask.insertId });
}

const deleteTask = async (request, response) => {
    const {id} = request.params;
    const deletedTask = await tasksModel.deleteTask(id);

    if (deletedTask.affectedRows === 0) return response.status(400).json({ message: "id not found" });

    return response.status(201).json();
}

const updateTask = async (request, response) => {
    const {id} = request.params;
    const updatedTask = await tasksModel.updateTask(id, request.body);

    if (updatedTask.affectedRows === 0) return response.status(400).json({ message: "id not found" });

    return response.status(201).json();
}

module.exports = {
    getTasks,
    createTask,
    deleteTask,
    updateTask
};
