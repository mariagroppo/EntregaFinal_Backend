import mongoose from "mongoose";

const ticketsSchema = new mongoose.Schema({
    codeTicket: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    cart: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'cartscollection'
    },
    amount: { type: Number },
    purchaser: { 
        type: mongoose.Schema.Types.ObjectId,
        ref:'userscollection'
    }
});

export const Ticket = mongoose.model("ticketscollection", ticketsSchema )