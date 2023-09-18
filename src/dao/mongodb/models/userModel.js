import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    first_name:{type: String},
    last_name: {type: String},
    userEmail: {type: String},
    role: { type: String, default: "user" },
    hashedPassword: {type: String},
    last_connection: {type: String, required: false},
    procedureStatus: {type: String, required: false, default: "Incompleted"},
    DNI: {type: String, required: false, default: "Incompleted"},
    comprobante1: {type: String, required: false, default: "Incompleted"},
    comprobante2: {type: String, required: false, default: "Incompleted"},
});

const UserModel = mongoose.model("userscollection", schema);

export default UserModel;