const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');

const dotenv = require('dotenv').config();

const app = express();

const pass = process.env.DB_PASS;
const port = process.env.PORT || 3000;

// middle ware for applying links direct
app.use(express.static(path.join(__dirname, 'pages')));


// Conneting to Db

// mongoose.connect(`mongodb+srv://saudvijaysingh:4Fvb0EqLNSk6jQMI@formdata.udb0jm0.mongodb.net/registrationFormDB`);
const connectToDatabase = async () => {
    try {
      await mongoose.connect(`mongodb+srv://saudvijaysingh:${pass}@formdata.udb0jm0.mongodb.net/registrationFormDB`);
  
      console.log('Connected to MongoDB!');
  
      // Now you can perform database operations
  
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message);
    }
  };
  
  // Call the connectToDatabase function
connectToDatabase();


// Db Schema

const formSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
})

// model of registration schema
const Registration = mongoose.model("Registration", formSchema);

app.use(bodyParser.urlencoded({extended : true})); // for making data in readable

app.use(bodyParser.json());

// getting register page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.post("/register", async(req, res)=>{
    try{
        const {name, email, password, confirm_password} = req.body;

        // making obj

        const existingUser = await Registration.findOne({email});

        if(!existingUser && password === confirm_password){

          const userData = new Registration({
            name,
            email,
            password,
          });
          // console.log(userData);
          await userData.save();
          res.redirect("login");
        }
        else{
          res.send("User Already Exits!");
        }
    }
    catch(err){
        // console.log(err);
        res.redirect("error");
    }
})


app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'login.html'));
});

app.post("/login", async(req, res)=>{

    const {name, email, password} = req.body;

    const existingUser = await Registration.findOne({ name, email, password });

    // console.log("Request body:", req.body);

    if (existingUser) {
      console.log("user present in Db ");
      res.redirect("success");
    } else {
        res.redirect("error");
      // console.log('User not found');
    }

})


app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'success.html'));
});

app.get("/error", (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'error.html'));
});





app.listen(port, (req, res)=>{
    console.log(`Server is running ${port}`);
})


