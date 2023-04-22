import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { taskRouter } from "./routes/tasks";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/tasks", taskRouter);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.listen(process.env.PORT, ()=> {console.log("Servidor iniciado!")});