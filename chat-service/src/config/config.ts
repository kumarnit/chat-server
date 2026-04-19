import { config } from "dotenv";

let configFile = `./.env`;

config({ path: configFile });

const { MONGO_URI, PORT, JWT_SECRET, NODE_ENV, MESSAGE_BROKER_URL, REDIS_URL } =
    process.env;

const queue = { notifications: "NOTIFICATIONS" };

export default {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    queue,
    REDIS_URL
};