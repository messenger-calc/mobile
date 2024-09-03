import { io } from "socket.io-client";

const socket = io("https://call-back-production.up.railway.app/");

export default socket;
