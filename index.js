import express from "express";
import cors from "cors";

import { loadBackend_njo } from "./routes/index-NJO.js";
var app = express();
app.use(cors());



var port = process.env.PORT || 3000;



//var routeARM = require("./routes/index-arm");

app.use(express.json())
//app.use("/", express.static("./public"));






//Rutas

    
loadBackend_njo(app);

    

    
    app.listen(port, () => {
    console.log(`Server ready in  port ${port}`);

});