import { Server } from "http";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import app from "./app";
import { connectDB } from "./database";
import config from "./config/config";
import { initSocket } from "./services/SocketService";

let server: Server;
connectDB();

// CORS Configuration
const corsOptions = {
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

server = app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

const io = new SocketIOServer(server, {
    cors: corsOptions,
    transports: ["websocket", "polling"],
});

initSocket(io);

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: unknown) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);