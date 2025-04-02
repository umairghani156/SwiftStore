import express from 'express';
import "dotenv/config";
import userRouter from './routes/userRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the User API!');
});

app.use('/api/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})