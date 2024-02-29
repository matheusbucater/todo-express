const validateUserBody = (request, response, next) => {
    const {body} = request;

    if (body.username === undefined | body.username === "") return response.status(400).json({ message: "username field is required" });
    if (body.email === undefined | body.email === "") return response.status(400).json({ message: "email field is required" });
    if (body.password === undefined | body.password === "") return response.status(400).json({ message: "password field is required" });
    
    next();
};

module.exports = {
    validateUserBody
};
