import express from "express";
import { TaskModel } from "../models/Tasks.js";

const router = express.Router();

router.get("/", async (req, res) => {

});

router.post("/create", async (req, res) => {
    try {
        const task = new TaskModel(req.body);

        await task.save();

        res.json({ message: "Tarefa criada!" });
    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Erro ao criar tarefa!" });
    }
});


export { router as taskRouter };