import express, { Application, Request, Response, NextFunction } from 'express';
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

// ৪MD - Not Found Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'API Endpoint Not Found',
    errorMessages: [
      {
        path: req.originalUrl,
        message: 'Your requested path is not valid',
      },
    ],
  });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    errors: err,
  });
});

export default app;