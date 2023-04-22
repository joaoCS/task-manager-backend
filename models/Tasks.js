import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    }
});

export const TaskModel = mongoose.model("tasks", TaskSchema);