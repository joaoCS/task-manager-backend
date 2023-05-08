import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    descricao: {
        type: String
    },

    dataVencimento: {
        type: Number,
        required: true
    },
    concluded: {
        type: Boolean,
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
    
});

export const TaskModel = mongoose.model("tasks", TaskSchema);