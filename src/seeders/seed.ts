import mongoose from "mongoose";
import { Roles } from './../models/role.model';
import { db } from "./../Database/connect"

// connection to mongodb
const connect = () => {
    /** connection mongodb */
    db
};

// Drop existing roles if any
const roleModelSeed = () => Roles.deleteMany({});

const Seeders = {
    async seedRoleModel() {
        try {
            // make a bunch of role
            const role = [];
            for (let i = 0; i < 1; i += 1) {
                const name: string = "Admin";
                const description: string = "Able to do stuff";
                const ModifiedBy: string = "6078303713204c27b45bb98a";
                const permission: string[] = ["transaction.manage", 'transaction.view' ]
                const newRole = {
                    name,
                    description,
                    ModifiedBy,
                    permission
                };
                role.push(newRole);

            }

            await Roles.insertMany(role);
        } catch (error) {
            console.log("error out", error);
        }
    },
};

const migration = async() => {
    try {
        await connect();
        await roleModelSeed();
        await Seeders.seedRoleModel();
        console.log("db migration successful");
    } catch (error) {
        console.log("error me", error);
    }
};

migration();