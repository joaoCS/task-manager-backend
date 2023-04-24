import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

import { UserModel } from "../models/Users.js";

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, "secret", (err) => {
            if (err) {
                res.sendStatus(403);
                next();
            }
        });
        next();
    }
    else 
        res.sendStatus(401);
    
};

router.post("/createAdmin", async (req, res) => {
    const { username, email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
        res.status(403);
        return res.json({ message: "Email já cadastrado!" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({ username, email, password: hashedPassword });

        await newUser.save();

        res.json({ message: "Usuário cadastrado!" });
    } 
    catch (err) {
        res.status(500);
        res.json("Erro ao criar usuário!");
    }
});

export { router as userRouter };