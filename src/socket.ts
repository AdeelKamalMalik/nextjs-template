import { io, Socket } from "socket.io-client";

interface ServerToClientEvents {
  "new-comment": (data: { message: string; blogId: string; commentId: string; commenterId: string }) => void;
  "new-reply": (data: { message: string; commentId: string; replyId: string; replierId: string }) => void;
}

interface ClientToServerEvents {
  "join-room": (userId: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000",
  {
    transports: ["websocket"],
    withCredentials: true,
    autoConnect: true,
  }
);


export default socket;
