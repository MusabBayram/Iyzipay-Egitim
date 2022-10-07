import ApiError from "../error/ApiError";
import * as Cards from "../services/iyzico/methods/cards"
import Users from "../db/users";
import nanoid from "../utils/nanoid";
import Session from "../middlewares/Session";

export default (router) => {
    // Kart Ekleme
    router.post("/cards", Session, async(req,res) => {
         const { card } = req.body;
         console.log(card);
         res.json({
            test: 1
         })
         if(!req.user.cardUserKey){
            if(result?.status === "success" && result?.cardUserKey){
                const user = await Users.findOne({
                    _id: req.user?._id
                });
                user.cardUserKey = result?.cardUserKey;
                await user.save()
            }
         }
    })
}