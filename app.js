const dotenv = require("dotenv")
const express = require("express")
const hbs = require("hbs")
const path = require("path")
const mongoose = require("mongoose")     // Used to connect Mongodb database with nodejs app.
const { defaultCoreCipherList } = require("constants")
const alert = require("alert")



dotenv.config({path: "./config.env"})

// Using MongoDb Atlas(remote) for Messages 
mongoose.connect(process.env.DB, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    }).then(()=>{
        console.log("Connection Successful...")
    })
    .catch((err)=>{
        console.log(err)
    })


const app = express()          
const port = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));        // Needed only when POST or Patch request made
app.use(express.json())                                 // Needed to express To understand json data 

// Serving Static Files
app.use(express.static(path.join(__dirname)))

// Setting View Template Engine
const views_path = path.join(__dirname,"templates")
app.set("views", views_path)
app.set("view engine","hbs")

// Making Schema of Document
const messageDataSchema = new mongoose.Schema({
    Name : String,
    Email : String,
    Message : String
})




//Making Collection or defining collection
const MessageData = new mongoose.model("MessageData",messageDataSchema) 


//Routing
app.get("/",(req,res)=>{
    res.render("index.hbs")
})



// Handling Post request (Inserting Message Data in Data base)
app.post("/contact", async(req,res)=>{
    try{
        //Inserting Document in mongoDB database
        const doc = new MessageData(req.body);
        await doc.save();
        alert("Message Sent !")
        res.render("index.hbs")
    }
    catch(err){
        alert("Error in Sending Message !")
        res.send(err);
    }
    
})

// To handle invalid url request
app.get("*",(req,res)=>{
    res.render("404_error.hbs")
})

app.listen(port,()=>{
    console.log(`Server running at port ${port}`)
})