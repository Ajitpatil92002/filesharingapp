const express = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const port = 3001;

const SECRET_KEY = 'mysecretkey';
const SALT_ROUNDS = 10;

app.use(cors());
app.use(express.json());

const prisma = new PrismaClient();

// auth middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    });
};

//auth login/signup

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('username and password required');
    }

    const existinguser = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (existinguser) {
        return res.status(400).send('user already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    res.status(201).json({ msg: 'User created!!', user });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ username }, SECRET_KEY, {
                expiresIn: '8h',
            });
            return res.json({ token });
        }

        res.status(401).send('Invalid Credentials');
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

app.get('/user', authenticateToken, async (req, res) => {
    const username = req.user.username;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

// delete user /user (delete req)

// update user /user (put req)

// File sharing App

//Creating file : POST
app.post('/file', authenticateToken, async (req, res) => {
    const { filename, content } = req.body;
    const username = req.user.username;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!filename || !content) {
            return res.status(400).send('filename and content required');
        }

        const file = await prisma.file.create({
            data: {
                filename,
                content,
                userId: user.id,
            },
        });

        res.status(201).json(file);
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

//Reading file : GET
app.get('/file/:filename', authenticateToken, async (req, res) => {
    const { filename } = req.params;
    const username = req.user.username;

    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }
        if (!filename) {
            return res.status(400).send('filename required');
        }
        const file = await prisma.file.findFirst({
            where: {
                filename,
            },
        });
        if (!file) {
            return res.status(404).send('File not found');
        }
        res.status(200).json(file);
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

//Updating file :PUT

app.put('/file/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const username = req.user.username;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!id || !content) {
            return res.status(400).send('id and content required');
        }

        const file = await prisma.file.update({
            where: {
                id: parseInt(id),
            },
            data: {
                content,
            },
        });
        res.status(200).json(file);
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

//DELETing file : Delete
app.delete('/file/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const username = req.user.username;
    try {
        const user = await prisma.user.findUnique({
            where: {
                username,
            },
        });

        if (!user) {
            return res.status(404).send('User not found');
        }
        if (!id) {
            return res.status(400).send('id required');
        }
        const file = await prisma.file.delete({
            where: {
                id: parseInt(id),
            },
        });
        if (!file) {
            return res.status(404).send('File not found');
        }
        res.send('File is Deleted');
    } catch (error) {
        console.error(error);

        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
