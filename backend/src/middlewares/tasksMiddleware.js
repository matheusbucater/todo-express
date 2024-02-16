const validateBody = (request, response, next) => {

    const {body} = request;

    if (request.method === "POST") {
        if (body.title === undefined) return response.status(400).json({ message: "title field is required" });
    }

    if (request.method === "PUT") {
        if (body.title === undefined && body.status === undefined) return response.status(400).json({ message: "either title or status fields are required" });
    }

    if (body.title === "") return response.status(400).json({ message: "title field cannot be empty" });

    next();

};

const validateParams = (request, response, next) => {

    const {id} = request.params;
    const intId = parseInt(id);

    if (Number.isNaN(intId) || intId < 0) return response.status(400).json({ message: "id has to be a valid positive integer" });

    next();
}

module.exports = {
    validateBody,
    validateParams
};
