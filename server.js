import express from 'express';
import mongoose from 'mongoose';
import taskRoutes from './routes/tasks.js';
import userRoutes from './routes/users.js';

const app = express();

mongoose.connect('mongodb://localhost:27017/gamified_pm', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
