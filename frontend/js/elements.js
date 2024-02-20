import { updateTaskTitle, updateTaskStatus, deleteTask } from "./handlers.js";
import { loadTasks } from "./script.js";

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

const createTaskDiv = (task) => {
    const hr = createElement("hr");
    const li = createElement("li");
    const div = createElement("div", `task${task.id}`);
    const span = createElement("span", "taskInfo");
    const p = createElement("p", "taskError");
    const keyboardReturnIcon = createIcon("keyboard_return");
    const checkbox = createCheckbox(true ? task.status == 1 : false, task.id, task.title);
    const newTaskInput = createTextInput(task.title, task.id);

    li.appendChild(checkbox);
    li.appendChild(newTaskInput);
    li.appendChild(keyboardReturnIcon);
    li.appendChild(span);
    li.appendChild(p);

    div.appendChild(li);
    div.appendChild(hr);

    checkbox.addEventListener("change", ({target}) => {
        updateTaskStatus(target)
            .then(() => {
                loadTasks();
                p.innerText = "";
            })
            .catch(()=> {
                target.checked = !target.checked;
                span.innerText = "";
                p.innerText = "failed to update task status";
            });
    });

    checkbox.addEventListener("blur", () => {
        p.innerText = "";
    });


    newTaskInput.addEventListener("input", ({target}) => {
        const { value, defaultValue } = target;

        p.innerText = "";
        target.style.width = value.length + "ch";

        if (value.trim() != defaultValue) {
            span.classList.remove("taskDelete");
            span.classList.add("taskEdit");
            span.innerText = "[enter] to edit";
        }
        if (value.trim() === "") {
            span.classList.remove("taskEdit");
            span.classList.add("taskDelete");
            span.innerText = "[enter] to delete";
        }
    });

    newTaskInput.addEventListener("blur", ({target}) => {
        span.innerText = "";
        p.innerText = "";
        target.value = target.defaultValue;
        target.style.width = target.value.length + "ch";
    });

    newTaskInput.addEventListener("keypress", ({key, target}) => {
        if (key === "Enter" && target.value.trim() !== target.defaultValue) {
            if (target.value.trim() === "") {
                deleteTask(target)
                    .then(() => {
                        loadTasks();
                        p.innerText = "";
                    })
                    .catch(() => {
                        p.innerText = "failed to delete task";
                        span.innerText = "";
                    });
            } else {
                updateTaskTitle(target)
                    .then(() => {
                        loadTasks();
                        p.innerText = "";
                        target.defaultValue = target.value.trim();
                        target.blur();
                    })
                    .catch(() => {
                        p.innerText = "failed to update task title";
                        span.innerText = "";
                    });
            }
        }
    });


    return div;
};

export {
    createElement,
    createTaskDiv
};
