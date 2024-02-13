
import dotenv from "dotenv";
dotenv.config();
import { createAppClient } from "./app";
import * as redis from "redis"
const { PORT, REDIS_URL } = process.env

const startServer = async () => {
    console.log('start up the server')
    const client = redis.createClient({url: REDIS_URL});
    await client.connect();

    const app = createAppClient(client)
    const server = app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    })
    return server
}


const server = startServer()
const gracefulShutdown = async () => {
    const _server = await server;
    _server.close(() => {
        console.log("graceful shutdown");
        process.exit()
    })
}

process.on("SIGTERM", gracefulShutdown)

process.on("SIGINT", gracefulShutdown)
