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
    })
}