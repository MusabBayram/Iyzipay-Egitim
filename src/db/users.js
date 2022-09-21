import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import nanoid from '../utils/nanoid'

const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

const randomColorGenerator = () => {
    return Math.floor(Math.random() * 16777215).toString(16)
}

const UserSchema = new Schema({
    uid:{
        type: String,
        default: nanoid(),
        unique: true,
        require: true
    },
    locale:{
        type: String,
        require: true,
        default: "tr",
        enum: ["tr", "en"]
    },
    role:{
        type: String,
        require: true,
        default: "user",
        enum: ["user", "admin"]
    },
    name:{
        type: String,
        require: true
    },
    surname:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    phoneNumber:{
        type: String,
        require: true,
        unique: true
    },
    identityNumber:{
        type: String,
        require: true,
        default: "00000000000"
    },
    password:{
        type: String,
        require: true
    },
    avatarUrl:{
        type: String
    },
    avatarColor:{
        type: String,
        default: randomColorGenerator(),
        require: true
    },
    address:{
        type: String,
        require: true
    },
    city:{
        type: String,
        require: true
    },
    country:{
        type: String,
        require: true,
        default: "Turkey"
    },
    zipCode:{
        type: String,
        require: true
    },
    ip:{
        type: String,
        require: true,
        default: "85.34.78.112"
    },
    cardUserKey:{
        type: String,
        require: false,
        unique: true
    }
}, {
    _id:true,
    collection: "users",
    timestamps: true,
    toJSON:{
        transform: (doc, ret) => {
            delete ret.__v;
            delete ret.password;
            return{
                ...ret
            }
        }
    }
})

UsersSchema.pre("save", aync function(next){
    try {
        this.password = await bcrypt.hash(this.password, 10);
        return next()
    } 
    catch (err) {
        return next(err)
    }
    next()
})

const Users = mongoose.model("Users", UserSchema);

Users.starterData = [
    {
        _id: mongoose.Types.ObjectId("61d054de0d8af19519e88a61"),
        locale: "tr",
        name: "John",
        surname: "Doe",
        email: "email@email.com",
        phoneNumber: "+905350000000",
        identityNumber: "74300864791",
        password: "123456",
        avatarUrl: "https://i.pravatar.cc/300",
        address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34732",
        ip: "85.34.78.112"
    }
]

Users.exampleUserCardData = {
    cardAlias: "Benim Kartım",
    cardHolderName: "John Doe",
    cardNumber: "5528790000000008",
    expireMonth: "12",
    expireYear: "2030",
    cvc: "123"
}

Users.initializer = async() => {
    const count = await Users.estimatedDocumentCount();
    if(count === 0){
        const created = await Users.create(Users.starterData)
        console.log(`${created.length} users created`);
        console.log(Users.starterData);
    }
}

Users.initializer();


export default Users;