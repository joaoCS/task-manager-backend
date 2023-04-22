import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

import { UserModel } from "../models/Users";

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