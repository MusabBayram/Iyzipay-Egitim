import mongoose from 'mongoose';
import nanoid from '../utils/nanoid'

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const ProductsSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    images:{
        type: [String],
        required: true
    },
    categories:{
        type: [String],
        required: true
    },
    brand:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    currency:{
        type: String,
        required: true,
        default: "TRY",
        enum: ["TRY", "USD", "EUR"]
    },
    stock:{
        type: Number,
        default: 1,
        required: true
    },
    itemType:{
        type: String,
        required: true,
        default: "PHYSICAL",
        enum: ["PHYSICAL", "VIRTUAL"]
    },

})