import mongoose from 'mongoose';
import nanoid from '../utils/nanoid'
import Products from './products';

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const CardsSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false,
        required: true
    },
    buyer:{
        type: ObjectId,
        ref: "Users",
        required: true
    },
    products:{
        type: [ObjectId],
        ref: "Products",
        required: true
    },
    currency:{
        type: String,
        required: true,
        default: "TRY",
        enum: ["TRY", "USD", "EUR"]
    },
},{
    _id:true,
    collection: "cards",
    timestamps: true,
    toJSON:{
        transform: (doc, ret) => {
            delete ret.__v;
            return{
                ...ret
            }
        }
    }
})

const Cards = mongoose.model("Cards", CardsSchema);

Cards.starterData = {
    _id: mongoose.Types.ObjectId('61d05524bf858c7449e9d456'),
    buyer: new mongoose.Types.ObjectId('61d054de0d8af19519e88a61'),
    completed: false,
    products: [
        mongoose.Types.ObjectId('61d054e5a2f56187efb0a3b2'),
        mongoose.Types.ObjectId('61d055016272c60f701be7ac'),
        mongoose.Types.ObjectId('61d055095087612ecee33a20'),
    ],
    currency: 'TRY'
}

Cards.initializer = async() => {
    const count = await Cards.estimatedDocumentCount();
    if(count === 0){
        const created = await Cards.create(Cards.starterData)
        console.log(`${created.length} Cards created`);
        console.log(Cards.starterData);
    }
}

Cards.populationTest = async () => {
    const cart = await Cards.findOne({
        _id: Cards.starterData._id
    }).populate('products', {
        name: 1,
        price: 1,
        categories: 1,
        brand: 1,
        images: 1,
        currency: 1, 
        stock: 1,
        itemType: 1
    }).populate('buyer');
    console.log(cart);
}

// Cards.initializer().then(async res => {
//     await Cards.populationTest()
// });

Cards.populationTest()

export default Cards;