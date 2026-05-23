import dotenv  from 'dotenv';
import express from 'express';
import cors    from 'cors';
import path    from 'path';

import { Ress } from './core';
import { default as ctrl_chess } from './ctrl_chess';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// === middleware ===

app.use(express.static(path.join(process.cwd(), 'static')));
app.use(cors({
    origin: ['https://keronon.github.io'],
    methods: ['GET', 'POST', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Location'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === API ===

app.get('/api/chess', async (req, res) => await ctrl_chess(req, res));

app.get('/api/check', (req, res) => {
    console.log('check done');
    res.json(Ress.ok());
});

app.use((req, res) => { res.redirect(301, '/'); });

// === Starter ===

const server = app.listen(PORT, () => {
    const address = server.address();

    if (address && typeof address == 'object') {
        const ip = address.address == '::' ? 'localhost' : address.address;
        const port = address.port;

        console.log(`Сервер запущен на http://${ip}:${port}`);
    } else if (typeof address == 'string') {
        console.log(`Сервер запущен на ${address}`);
    }
});

// === Render LifeKeeper ===

const lifeKeeper = setInterval(async () => {
    console.log("keep alive");
    try {
        const fetchData = {
            method: 'HEAD',
            cache : 'no-cache',
            signal: AbortSignal.timeout(5000)
        };
        const checkPath = 'https://keronon-schemata.onrender.com/api/check';
        let response: Response;

        response = await fetch(checkPath, fetchData);
        if (response.ok) {
            console.log('ok');
        } else {
            console.warn(`nok status: ${response.status}`);
        }
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error("keep timeout");
        }
        console.error("dead");
    }
}, 600_000);
