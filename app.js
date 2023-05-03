require("dotenv").config(); 
const express = require("express"); 
const app = express();
require("./db/conn")
const cors = require("cors"); 
const router=require("./routes/router");
const PORT = process.env.PORT || 6010


app.use(cors());
app.use(express.json());

// app.get("/", (req, res)=>{
// res.status(201).json("server start")
// });

app.use(router)
app.listen(PORT, ()=>{
console.log(`Server start at port no ${PORT}`)
})