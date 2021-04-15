import express,  { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import logger from 'morgan';
import "dotenv/config";
import router from './routes';
// import { CronJob } from 'cron';


require("./Database/connect");

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", router);


// const job = new CronJob('* * * * * *', function() {
//   console.log('You will see this message every second');
// }, null, true, 'America/Los_Angeles');
// job.start()

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

  export default app