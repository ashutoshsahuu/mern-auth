import express from 'express';
import { connectDB } from './db.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import path from 'path';

dotenv.config();

connectDB();

const __dirname = path.resolve();
const app = express();

app.use(express.static(path.join(__dirname, 'client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`server started at port ${PORT}`) });

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      success: false,
      message,
      statusCode,
    });
  });