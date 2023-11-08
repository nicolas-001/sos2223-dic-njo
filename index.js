import express from "express";
import cors from "cors";
import {handler} from "./frontend/build/handler.js"
import { loadBackend_njo_v2 } from "./routes/index-NJO-v2.js";
var app = express();




var port = process.env.PORT || 12345;



//var routeARM = require("./routes/index-arm");

app.use(express.json())
//app.use("/", express.static("./public"));

//Proxy:






//Rutas
app.use(cors());
    
loadBackend_njo_v2(app);

app.use(handler);
    

    
    app.listen(port, () => {
    console.log(`Server ready in  port ${port}`);

});