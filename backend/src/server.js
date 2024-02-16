const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.MYSQL_PORT;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
