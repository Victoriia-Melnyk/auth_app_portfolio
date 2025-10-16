'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: process.env.CLIENT_HOST || 'http://localhost:3000',
		credentials: true,
	})
);

app.use(authRouter);
app.use(userRouter);

// ==== Serve React static files ====
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../client/build')));

// ✅ Для Express 5: RegExp або app.use
app.get(/.*/, (req, res) => {
	res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

// ==== Error handler ====
app.use((err, req, res, next) => {
	res.status(err.status || 500).json({
		message: err.message || 'Internal Server Error',
		...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
	});
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
