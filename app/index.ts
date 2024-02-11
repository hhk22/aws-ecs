
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
    app.listen(PORT, () => {
        console.log(`App listening at port ${PORT}`);
    })
}


startServer()
