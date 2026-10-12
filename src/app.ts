import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes/index';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// অ্যাপ্লিকেশন রুট
app.use('/api/v1', router);

// টেস্ট রুট
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Emergency Ambulance Dispatch Server is running!',
  });
});

export default app;