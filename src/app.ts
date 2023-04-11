import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './database/connectMongo';
import userRouter from './routers/user.route';
import authRouter from './routers/auth.route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;
const env = process.env.NODE_ENV;

// Body parser
app.use(express.json({}));

// Cookie parser
app.use(cookieParser());

// Logger
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Cors
app.use(
  cors({
    origin: `http://localhost:${port}`,
    credentials: true,
  })
);

// Routes
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

// Testing
app.get('/testChecker', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to JWT test',
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('JWT + Express + TypeScript Server');
});

// Unknown Routes
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

app.listen(port, () => {
  console.log(
    `[server]: Server is running at http://localhost:${port} in ${env}`
  );
  connectDB();
});
