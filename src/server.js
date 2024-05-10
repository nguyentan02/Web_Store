require("dotenv").config();
const app = require('./app')
const config = require('./config/index');
// const MongoDB = require('./app/utils/mongodb.util')
const db = require('./databases/init.mongodb')

async function startServer() {
    try {
        db.connet();
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}.`);
        })
    } catch (error) {
        console.log("Cannot connect to the database !", error);
        process.exit();
    }
}
startServer();