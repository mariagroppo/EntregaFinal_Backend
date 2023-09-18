/* MONGOOSE ---------------------------------------- */
import mongoose from 'mongoose';
import config from '../../config/config.js';

export async function connection () {
    try {
        await mongoose.connect(config.mongo.URL, {
            useNewUrlParser:true,
            useUnifiedTopology: true
        });
        console.log("Conectado a Mongo");
    } catch (error) {
        console.log(error);
    }
}