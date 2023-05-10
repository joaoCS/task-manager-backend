import express from "express";
import { TaskModel } from "../models/Tasks.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

const router = express.Router();

router.get("/", verifyToken, async (req, res) => {
    const { userid } = req.headers;
    try {
        const tasks = await TaskModel.find({}).where("userId").equals(userid).exec(); // retorna todas as tasks

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

router.put("/edit", verifyToken, async (req, res) => {
    const { userId, _id, titulo, descricao, dataVencimento, concluded } = req.body;

    const task = await TaskModel.findById(_id);
    
    if(!task) {
        res.status(500);
        return res.json({ message: "Tarefa não existe!" });
    }
    
    if(task.userId.toString() !== userId) {
        res.status(403);
        return res.json({ message: "Tarefa não pertence ao usuário!" });
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

router.delete("/delete", verifyToken, async (req, res) => {
    const { taskId } = req.body;

    if(!taskId) {
        res.status(500);
        return res.json({ message: "Id da tarefa não fornecido!" });
    }

    try {
        await TaskModel.deleteOne({ _id: taskId });
        res.json({ message: "Tarefa removida!" });
    } 
    catch (err) {
        res.status(500);
        return res.json({ message: "Erro ao remover cliente!" });
    }
});

export { router as taskRouter };