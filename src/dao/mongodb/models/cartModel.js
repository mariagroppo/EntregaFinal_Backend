import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    idCart:{ type: Number, required: true, index: true },
    timestamp: { type: String, required: true },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userscollection'
    },
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'productscollection'
                },
                quantity: {
                    type: Number,
                    default: 1
                }

            }
        ],
        default: []
    },
    cartStatus: { type: Boolean, default: true }
});


export const Cart = mongoose.model("cartscollection", cartsSchema )