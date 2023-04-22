import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";

dotenv.config();
const app = express();

app.use(cors());
app.use(bodyParser.json());


mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.listen(process.env.PORT, ()=> {console.log("Servidor iniciado!")});