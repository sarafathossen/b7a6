import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes/index';
import globalErrorHandler from './app/middleware/globalErrorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/v1', router);


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Emergency Ambulance Dispatch Server is running!',
  });
});


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


app.use(globalErrorHandler);

export default app;