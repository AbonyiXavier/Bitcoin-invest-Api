import mongoose from 'mongoose'

const MONGO_CONFIG = {
  connectTimeoutMS: 30000,
  keepAlive: true,
  socketTimeoutMS: 0,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
};
const url = `${process.env.MONGO_URI}`;

export const db = mongoose.createConnection(url, MONGO_CONFIG);

db.then(() => console.log('Database connected'))
  .catch((err: Error) => console.log("err", err));
  