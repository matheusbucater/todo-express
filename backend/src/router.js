const express = require("express");

const tasksMiddleware = require("./middlewares/tasksMiddleware");
const tasksController = require("./controllers/tasksController");

const router = express.Router();

router.get("/tasks", tasksController.getTasks);
router.post("/tasks", tasksMiddleware.validateBody, tasksController.createTask);
router.delete("/tasks/:id", tasksMiddleware.validateParams, tasksController.deleteTask);
router.put("/tasks/:id", [tasksMiddleware.validateParams, tasksMiddleware.validateBody], tasksController.updateTask);

module.exports = router;
