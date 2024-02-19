const fetchTasks = async () => {
    const response = await fetch("http://localhost:8080/tasks?ordered=true");
    const tasks = await response.json();
    return tasks;
};

const createElement = (tag, className="") => {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    return element;
};

const createCheckbox = (checked, valueName, idName) => {
    const checkbox = createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("value", valueName);
    checkbox.setAttribute("id", idName);
    checkbox.checked = checked;
    return checkbox;
};

const createIcon = (iconText) => {
    const icon = createElement("spam", "material-symbols-outlined");
    icon.innerText = iconText;
    return icon;
};

const createTextInput = (taskTitle, idName) => {
    const textInput = createElement("input");
    textInput.setAttribute("type", "text");
    textInput.setAttribute("id", idName);
    textInput.classList.add("taskTitle");
    textInput.value = taskTitle;
    textInput.defaultValue = taskTitle;
    textInput.style.width = taskTitle.length + "ch";
    return textInput;
}

const createListItem = (task) => {
    const ul = document.getElementsByClassName("tasksList")[0];
    const hr = createElement("hr");
    const li = createElement("li");
    const div = createElement("div", `task${task.id}`);
    const span = createElement("span", "taskInfo");
    const p = createElement("p", "taskError");

    const keyboardReturnIcon = createIcon("keyboard_return");

    const checkbox = createCheckbox(true ? task.status == 1 : false, task.id, task.title);
    checkbox.addEventListener("change", (e) => {
        updateTaskStatus(e.target)
            .then(() => p.innerText = "")
            .catch(()=> {
                e.target.checked = !e.target.checked;
                p.innerText = "failed to update task status";
            });
    });

    checkbox.addEventListener("blur", (e) => {
        p.innerText = "";
    });

    const newTaskInput = createTextInput(task.title, task.id);

    newTaskInput.addEventListener("input", (e) => {
        if (e.target.value.trim() != e.target.defaultValue) {
            span.classList.remove("taskDelete");
            span.classList.add("taskEdit");
            span.innerText = "[enter] to edit";
        }
        if (e.target.value.trim() === "") {
            span.classList.remove("taskEdit");
            span.classList.add("taskDelete");
            span.innerText = "[enter] to delete";
        }
        e.target.style.width = e.target.value.length + "ch";
    });

    newTaskInput.addEventListener("blur", (e) => {
        span.innerText = "";
        p.innerText = "";
        e.target.value = e.target.defaultValue;
        e.target.style.width = e.target.value.length + "ch";
    });

    newTaskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && e.target.value.trim() !== e.target.defaultValue) {
            if (e.target.value.trim() === "") {
                deleteTask(e.target)
                    .then(() => p.innerText = "")
                    .catch(() => p.innerText = "failed to delete task");
            } else {
                updateTaskTitle(e.target)
                    .then(() => {
                        p.innerText = "";
                        e.target.defaultValue = e.target.value
                        e.target.blur();
                    })
                    .catch(() => p.innerText = "failed to update task title");
            }
        }
    });

    li.appendChild(checkbox);
    li.appendChild(newTaskInput);
    li.appendChild(keyboardReturnIcon);
    li.appendChild(span);
    li.appendChild(p);

    div.appendChild(li);
    div.appendChild(hr);

    ul.appendChild(div);
};

const loadTasks = async () => {
    const ul = document.getElementsByClassName("tasksList")[0];
    ul.innerHTML = "";

    const tasks = await fetchTasks()
        .then((response) => {
            response.forEach((task) => {
                createListItem(task); 
            });
        })
        .catch(() => {
            const taskInput = document.getElementsByClassName("taskInput")[0];
            const span = createElement("span", "taskFail");

            taskInput.readOnly = true;
            span.innerText = "failed to load tasks";
            ul.appendChild(span);
        });
}

const addTask = async (target) => {

    const { value } = target;
    const taskBody = { title: value.trim() };

    await fetch("http://localhost:8080/tasks", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    })
        .then(async (response) => {
            if (response.status === 201) {
                const { insertId } = await response.json();
                const task = { id: insertId, title: value.trim(), status: 0 };
                createListItem(task);
                target.value = "";
            } else {
                document.querySelector("span.taskError").innerText = "failed to add new task";
            }
        })
        .catch(() => {
            document.querySelector("span.taskError").innerText = "failed to add new task";
        });
}

const updateTaskStatus = async (target) => {

    const { value, checked } = target;

    const checkStatus = 1 ? checked : 0;
    const taskBody = { status: checkStatus };

    await fetch(`http://localhost:8080/tasks/${value}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    })
}

const updateTaskTitle = async (target) => {
    const { id, value } = target;

    const taskBody = { title: value };

    await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    });
}

const deleteTask = async (target) => {
    const { id } = target;
    await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "delete"
    })
        .then(() => {
            document.getElementsByClassName(`task${target.id}`)[0].remove();
        });
}

window.onload = () => {
    loadTasks();

    const taskInput = document.getElementsByClassName("taskInput")[0];
    taskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask(e.target);
        }
    });
    taskInput.addEventListener("blur", () => {
        document.querySelector("span.taskError").innerText = "";
    });
}
