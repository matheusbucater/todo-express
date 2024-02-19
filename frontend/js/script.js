const fetchTasks = async () => {
    const response = await fetch("http://localhost:8080/tasks");
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
    const em = createElement("span", "taskInfo");

    const keyboardReturnIcon = createIcon("keyboard_return");

    const checkbox = createCheckbox(true ? task.status == 1 : false, task.id, task.title);
    checkbox.addEventListener("change", (e) => {
        updateTaskStatus(e.target);
    });

    const newTaskInput = createTextInput(task.title, task.id);

    newTaskInput.addEventListener("input", (e) => {
        if (e.target.value.trim() === "") {
            em.classList.remove("taskEdit");
            em.classList.add("taskDelete");
            em.innerText = "[enter] to delete";
        }
        else {
            em.classList.remove("taskDelete");
            em.classList.add("taskEdit");
            em.innerText = "[enter] to edit";
        }

        e.target.style.width = e.target.value.length + "ch";
    });

    newTaskInput.addEventListener("blur", (e) => {
        em.innerText = "";
        e.target.value = e.target.defaultValue;
        e.target.style.width = e.target.value.length + "ch";
    });

    newTaskInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            if (e.target.value.trim() === "") {
                deleteTask(e.target);
            } else {
                updateTaskTitle(e.target)
                .then(() => {
                    e.target.defaultValue = e.target.value
                    e.target.blur();
                });
            }
        }
    });

    li.appendChild(checkbox);
    li.appendChild(newTaskInput);
    li.appendChild(keyboardReturnIcon);
    li.appendChild(em);

    div.appendChild(li);
    div.appendChild(hr);

    ul.appendChild(div);
};

const loadTasks = async () => {
    const ul = document.getElementsByClassName("tasksList")[0];
    ul.innerHTML = "";

    const tasks = await fetchTasks();
    tasks.forEach((task) => {
       createListItem(task); 
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
        }
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
    .catch(() => target.checked = !checked);
}

const updateTaskTitle = async (target) => {
    const { id, value } = target;
    
    const taskBody = { title: value };

    await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    })
    .then(console.log(target));
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

    document.getElementsByClassName("taskInput")[0].addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            addTask(e.target);
        }
    });
    
}
