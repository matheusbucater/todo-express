const express = require("express");

const tasksMiddleware = require("./middlewares/tasksMiddleware");
const tasksController = require("./controllers/tasksController");

const usersMiddleware = require("./middlewares/usersMiddleware");
const usersController = require("./controllers/usersController");

const router = express.Router();

router.get("/tasks", tasksController.getTasks);
router.post("/tasks", tasksMiddleware.validateTaskBody, tasksController.createTask);
router.delete("/tasks/:id", tasksMiddleware.validateParams, tasksController.deleteTask);
router.put("/tasks/:id", [tasksMiddleware.validateParams, tasksMiddleware.validateTaskBody], tasksController.updateTask);

router.post("/users", usersMiddleware.validateUserBody, usersController.registerUser);

module.exports = router;
