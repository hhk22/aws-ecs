import request from "supertest";
import { App } from "supertest/types";
import { createAppClient, RedisClient } from "./app"
import * as redis from "redis"

let app: App;
let client: RedisClient

const REDIS_URL = "redis://:test_env@localhost:6380";

beforeAll(async () => {
    client = redis.createClient({url: REDIS_URL})
    await client.connect();
    app = createAppClient(client);
})

beforeEach(async () => {
    await client.flushDb();
})

afterAll(async () => {
    await client.flushDb();
    await client.quit();
})

describe("/POST messages", () => {
    it("task post messages", async () => {
        const response = await request(app)
            .post("/messages")
            .send({message: "testing with redis"});

        expect(response.status).toBe(200)
        expect(response.text).toBe("Added to list.")
    })
})


describe("/GET messages", () => {
    it("task get messages", async () => {
        await client.lPush("messages", ["msg1", "msg2"]);
        const response = await request(app).get("/messages");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(["msg2", "msg1"])

    })
})
