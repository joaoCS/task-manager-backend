import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

import { UserModel } from "../models/Users.js";

const JWT_SECRET = process.env.SECRET;
const host = process.env.HOST;

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err) => {
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

router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if(!user) {
        res.status(401);
        return res.json({ message: "Email não cadastrado!" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        res.status(401);
        return res.json({ message: "Senha incorreta!" });
    }

    const token = jwt.sign({  });
});


router.get("/username", async (req, res) => {

    try {
        const user = await UserModel.findById(req.headers.userid);

        if (!user) {
            res.status(500);
            return res.json({ message: "Usuário não encontrado!" });
        }

        return res.json({ username: user.username });
    }
    catch (err) {

        res.status(500);

        return res.json({ message: "Erro ao buscar usuário!" });
    }
});


router.get("/user/:id", async (req, res) => {
    const { id } = req.params;


    if(!id) {
        res.status(500);
        return res.json({ message: "Id de usuário não fornecido!" });
    }


    try {
        const user = await UserModel.findById(id);

        if (!user) {
            res.status(500);
            return res.json({ message: "Usuário não encontrado!" });
        }

        user.password = "";

        res.json(user);
    }
    catch(err) {
        res.status(500);

        return res.json({ message: "Erro ao bucar usuário" });
    }
});



router.put("/edit", async (req, res) => {

    const { email, username, _id } = req.body;

    const user = await UserModel.findById(_id);

    if (!user) {
        res.status(500);
        return res.json({ message: "Usuário não encontrado!" });
    }

    try {

        user.email = email;
        user.username = username;

        await user.save();

        res.json({ message: "Usuário editado com sucesso!" });

    }
    catch(err) {
        res.status(500);
        
        return res.json({ message: "Erro ao editar usuário!" });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = UserModel.findOne({ email });
        if (!user) {
            res.status(500);
            return res.json({ message: "Email não cadastrado!" });
        }

        const secret = JWT_SECRET + user.password;

        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });

        const link = `${host}/auth/reset-password/${user._id}/${token}`;


        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "a valid email address",
                pass: process.env.APP_KEY
            }
        });

        var mailOptions = {
            from: "a valid email address",
            to: email,
            subject: "Redefinição de senha",
            text: link
        };

        //const response = await transporter.sendMail(mailOptions);

        console.log(link);

        res.end();

    }
    catch(err) {
        return res.json({ message: "Algo deu errado!" });
    }
});


router.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;

    const user = UserModel.findOne({ _id: id });

    if (!user) {
        res.status(500);
        return res.json({ message: "Usuário não cadastrado!" });
    }

    const secret = JWT_SECRET + user.password;

    try {
        const verify = jwt.verify(token, secret);
        res.render("index", { email: verify.email });

    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Não verificado!" });
    }

});

router.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = UserModel.findOne({ _id: id });

    if (!user) {
        res.status(500);
        return res.json({ message: "Usuário não cadastrado!" });
    }

    const secret = JWT_SECRET + user.password;

    try {
        const verify = jwt.verify(token, secret);
        
        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
            {
                _id: id
            },

            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        res.json({ message: "Senha atualizada com sucesso!" });

    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Algo deu  errado!" });
    }

});

export { router as userRouter };