import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import 'dotenv/config';
import router from './routes';
import { checkInvestmentAndClose } from './controllers/transaction.controller';
import { CronJob } from 'cron';
const { shouldSendSameSiteNone } = require('should-send-same-site-none');

require('./Database/connect');

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(shouldSendSameSiteNone);

app.use('/api', router);

// const job = new CronJob(
//   '* * * * * *',
//   async () => {
const job = new CronJob(
  '00 00 01 * * 0-6',
  async () => {
    checkInvestmentAndClose();
  },
  null,
  true,
  'Europe/Brussels'
);
job.start();

// app.use('/uploads', express.static('uploads'));
app.use(express.static(__dirname));

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to My Bitcoin App',
  });
});
app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    error: 'resource not found',
  });
});

export default app;
