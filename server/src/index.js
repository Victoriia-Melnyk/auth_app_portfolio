'use strict';

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { authRouter } from './routes/auth.route.js';
import { userRouter } from './routes/user.route.js';
import { client } from './utils/db.js';
import { User } from './models/User.js';
import { Token } from './models/Token.js';

const PORT = process.env.PORT || 3000;
const app = express();

// ==== Middleware ====
app.use(express.json());
app.use(cookieParser());

app.use(
	cors({
		origin: process.env.CLIENT_HOST || 'http://localhost:3000',
		credentials: true,
	})
);

// ==== Routes ====
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

// ==== START SERVER ====
const start = async () => {
	try {
		// 1️⃣ Перевіряємо підключення до БД
		await client.authenticate();
		console.log('✅ Database connected successfully');

		// 2️⃣ Синхронізуємо всі моделі (створює таблиці, якщо їх немає)
		await client.sync({ alter: true });
		console.log('✅ All models were synchronized successfully');

		// 3️⃣ Запускаємо сервер тільки після підключення БД
		app.listen(PORT, () => {
			console.log(`🚀 Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error('❌ Failed to connect to the database:', error);
		process.exit(1);
	}
};

start();
