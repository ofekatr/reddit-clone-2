import "reflect-metadata";
import { createConnection } from "typeorm";
import express from 'express';
import morgan from 'morgan';
import { authRoutes } from "./routes/auth";
import { trimMiddleware } from "./middleware/trim";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(trimMiddleware);

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

