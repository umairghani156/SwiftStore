import express from 'express';
import "dotenv/config";
import userRouter from './routes/userRoutes.js';
import postRouter from './routes/postRoutes.js';
import commentRouter from './routes/commentRoutes.js';
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the User API!');
});

app.use('/api/users', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})