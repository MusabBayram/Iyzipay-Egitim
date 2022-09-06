import { logFile } from "./utils/logs";
import nanoid from "./utils/nanoid";

logFile("test1",{
    test: 2,
    name: "feza"
})

const id = nanoid();

console.log(id);