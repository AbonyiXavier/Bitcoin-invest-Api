// const path = require('path');
// const { Seeder } = require('mongo-seeding');

// const url = `${process.env.MONGO_URI}`;
// const config = {
//   database: {
//     database: url,
//   },
//   dropDatabase: true,
// };
// const collections = [
//   {
//     name: 'Administrator',
//     permissions: ['role.view'],
//     description: 'Admin privillage',
//   },
//   {
//     name: 'Super Admin',
//     permissions: ['role.view', 'role.manage'],
//     description: 'Sper Admin privillage',
//   },
// ];

// const seeder = new Seeder(config);
// const collections = seeder.readCollectionsFromPath(path.join(__dirname, '../data-import/role.ts'), {
//   transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
// });
// console.log('col', collections);

// seeder
//   .import(collections)
//   .then(() => {
//     console.log('Success');
//   })
//   .catch((err: any) => {
//     console.log('Error', err);
//   });

// const migration = async () => {
//   try {
//     await seeder.import(collections);
//   } catch (err) {
//     // Handle errors
//     console.log('Error', err);
//   }
// };

// migration();

// import mongoose from 'mongoose';
// import { Roles } from '../models/role.model';

// const url = `${process.env.MONGO_URI}`;

// // connection to mongodb

// const connect = () => {
//   /** connection mongodb */
//   mongoose
//     .connect(url, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       useCreateIndex: true,
//       useFindAndModify: false,
//     })
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
//     ModifiedBy: '608215ba18844514f000dd7f',
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
