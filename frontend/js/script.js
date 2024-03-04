import { createElement, createTaskDiv } from "./elements.js";
import { addTask } from "./handlers.js";
import { getCookie } from "./cookie.js";

const fetchTasks = async () => {
    return await fetch("http://localhost:8080/tasks?ordered=true")
        .then((response) => {
            if (response.status === 400) {
                return Promise.reject();
            }
            return response.json();
        });
};

const loadTasks = async () => {
    const ul = document.getElementsByClassName("tasksList")[0];
    ul.innerHTML = "";

    await fetchTasks()
        .then((tasks) => {
            tasks.forEach((task) => {
                const taskDiv = createTaskDiv(task);
                ul.appendChild(taskDiv);
            })
        })
        .catch(() => {
            const taskInput = document.getElementsByClassName("taskInput")[0];
            const span = createElement("span", "taskFail");

            taskInput.readOnly = true;
            span.innerText = "failed to load tasks";
            ul.appendChild(span);
        });
}

window.onload = () => {
    
    const token = getCookie("token");

    if (!token) {
        window.location.href = "./login.html";
    }

    loadTasks();

    const taskInput = document.getElementsByClassName("taskInput")[0];

    taskInput.addEventListener("keypress", ({key, target}) => {
        if (key === "Enter") {
            addTask(target)
                .then(() => {
                    loadTasks();
                    document.getElementsByClassName("taskInput")[0].value = "";
                })
                .catch(() => {
                    document.querySelector("span.taskError").innerText = "failed to add task";
                });
        }
    });

    taskInput.addEventListener("blur", () => {
        document.querySelector("span.taskError").innerText = "";
    });
}

export {
    loadTasks
};
