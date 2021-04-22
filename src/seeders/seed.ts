// import mongoose from 'mongoose';
// import { Roles } from '../models/role.model';

// const url = `${process.env.MONGO_URI}`;

// // connection to mongodb

// const connect = () => {
//   /** connection mongodb */
//   mongoose
//     .connect(
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//         useCreateIndex: true,
//         useFindAndModify: false,
//       }
//     )
//     .then(() => {
//       console.log('mongodb connected...');
//     })
//     .catch((err) => console.log(err.message));

//   mongoose.connection.on('connected', () => {
//     console.log('Mongoose connected to db');
//   });
// };
// // Drop existing roles if any
// // const roleModelSeed = () => Roles.deleteMany({});

// const data = [
//   {
//     name: 'user',
//     description: 'User role',
//     ModifiedBy: new Date(),
//     permissions: ['user.view', 'user.manage'],
//   },
// ];
// const Seeders = {
//   async seedRoleModel() {
//     try {
//       await Roles.insertMany(data);
//     } catch (error) {
//       console.log('error out', error);
//     }
//   },
// };

// const migration = async () => {
//   try {
//     await connect();
//     // await roleModelSeed();
//     await Seeders.seedRoleModel();
//     console.log('db migration successful');
//   } catch (error) {
//     console.log('error me', error);
//   }
// };

// migration();
