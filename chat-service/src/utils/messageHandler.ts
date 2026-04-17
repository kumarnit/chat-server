import { UserStatusStore } from "./userStatusStore";
import { rabbitMQService } from "../services/RabbitMQService";
import { sendPrivateMessage } from "../services/SocketService";
import { SOCKET_EVENT } from "./constants";

const userStatusStore = UserStatusStore.getInstance();

export const handleMessageReceived = async (
    senderName: string,
    senderEmail: string,
    receiverId: string,
    messageObj: any
) => {

    if (!sendPrivateMessage(receiverId, SOCKET_EVENT.PRIVATE_MESSAGE, messageObj)) {
        await rabbitMQService.notifyReceiver(
            receiverId,
            messageObj.message,
            senderEmail,
            senderName
        );
    }
};