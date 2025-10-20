import express from 'express';
import dotenv from 'dotenv';
import { wakeOnLanRouter } from './wakeOnLan/wakeOnLan.routes.js';
dotenv.config();
export const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(wakeOnLanRouter);
console.log(`the server is listening on port ${port}`);
export const server = app.listen(port);
export function stopServer() {
    server.close();
}
