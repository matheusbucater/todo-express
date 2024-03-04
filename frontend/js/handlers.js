
const addTask = async (target) => {
    const { value } = target;
    const taskBody = { title: value.trim() };

    await fetch("http://localhost:8080/tasks", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    }).then(({status}) => {
        if (status === 400) Promise.reject();
    });
}

const deleteTask = async ({id}) => {
    await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "delete"
    }).then(({status}) => {
        if (status === 400) Promise.reject()
    });
};

const updateTaskStatus = async (target) => {
    const { checked, value } = target;

    const checkStatus = 1 ? checked : 0;
    const taskBody = { status: checkStatus };

    await fetch(`http://localhost:8080/tasks/${value}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    }).then(({status}) => {
        if (status === 400) Promise.reject();
    });
}

const updateTaskTitle = async (target) => {
    const { id, value } = target;

    const taskBody = { title: value.trim() };

    await fetch(`http://localhost:8080/tasks/${id}`, {
        method: "put",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskBody)
    }).then(({status}) => {
        if (status === 400) Promise.reject();
    });
};

const login = async (userBody) => {

    await fetch("http://localhost:8080/login", {
        method: "get",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userBody)
    }).then((res) => {
        console.log(res.headers);
    });
}

export {
    addTask,
    deleteTask,
    updateTaskStatus,
    updateTaskTitle,
    login,
};
