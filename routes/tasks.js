import express from "express";
import { TaskModel } from "../models/Tasks.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const tasks = await TaskModel.find({}); // retorna todas as tasks

        res.json(tasks);
    }
    catch(err) {
        res.status(500);
        res.json({ message: "Erro ao buscar tarefas!" });
    }
});

router.post("/create", verifyToken, async (req, res) => {
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

router.post("/edit", verifyToken, async (req, res) => {
    const { userId, _id, titulo, descricao, dataVencimento, concluded } = req.body;

    const task = await TaskModel.findById(_id);
    if(!task) {
        res.status(500);
        return res.json({ message: "Tarefa não existe!" });
    }

    const user = await UserModel.findById(userId);
    if(!user) {
        res.status(401);
        return res.json({ message: "Usuário não encontrado!" });
    }

    try{
        task.userId = userId;
        task.titulo = titulo;
        task.descricao = descricao;
        task.dataVencimento = dataVencimento;
        task.concluded = concluded;

        await task.save();

        res.json({ message: "Tarefa alterada com sucesso!" });
    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Erro ao editar tarefa!" });
    }

});

export { router as taskRouter };