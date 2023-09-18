import { getChat } from "../controllers/chat.js";
import express from 'express';

const routerChat = express.Router();

/* GET Vista de todos los productos -------------------------------- */
routerChat.get('/', getChat);

export default routerChat;