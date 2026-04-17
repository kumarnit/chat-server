import { Server } from 'socket.io';
import { createClient, RedisClientType } from 'redis';
import { detokenizeToken, IUser } from '../utils';

export let redisClient: RedisClientType;
let io: Server;

export const initSocket = async (socketIoInstance: Server) => {
    io = socketIoInstance;

    redisClient = createClient({
        url: process.env.REDIS_URL
    });

    redisClient.on('error', err => console.error('Redis Client Error', err));

    redisClient.on('connect', () => console.error('Redis connected successfully!'));

    await redisClient.connect();

    io.on('connection', async socket => {
        console.log(`Socket Client coonected Id ${socket.id} `+ JSON.stringify(socket.handshake.query) );
        const accessToken = socket.handshake.query.accessToken;
        const user: IUser = await detokenizeToken(accessToken as string);
        const socketId = socket.id;
        socket.emit('userdetails', user._id);

        await redisClient.sAdd(`user:sockets:${user._id}`, socketId);
        console.log(`Mapping: user ${user._id}`);

        socket.on('disconnect', async () => {
            console.log(`Socket disconnected ${user._id} ${socketId}`);
            const socketMapping = await redisClient.sRem(`user:sockets:${user._id}`, socketId);
            console.log(`Disconnected removed sockets from redis: ${socketMapping}`)
            const remaining = await redisClient.sCard(`user:sockets:${user._id}`);
            if (remaining === 0) {
                console.log(`User ${user._id} is completely offline.`)
            }
        })
    });
}

export const sendPrivateMessage = async (toUserId: string, event: string, data: any) => {
    if(!io) {
        throw new Error("Socket.io not initialized!");
    }

    const targetSockets = await redisClient.sMembers(`user:sockets:${toUserId}`);
    
    if(targetSockets.length > 0){
        targetSockets.forEach((socketId) => {
            io.to(socketId).emit(event, data);
        });
        return true;
    }

    return false;
}