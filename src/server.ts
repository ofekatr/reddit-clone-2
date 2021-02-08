import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { trimMiddleware } from "./middleware/trim";
import { authRoutes } from "./routes/auth";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trimMiddleware);
app.use(cookieParser())

app.get('/', (_, res) => res.send("Hello World!"));
app.use('/api/auth', authRoutes);

app.listen(5000, async () => {
    console.log(`Server is running at http://localhost:5000`);

    try {
        await createConnection();
        console.log('Database connected!');

    } catch (error) {
        console.log(error);
    }
})

