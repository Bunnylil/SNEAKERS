require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://buruklynx:1gliU3JyND0sQoKS@3legant-project.ybsdj.mongodb.net/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    countryCode: String,
    phone: String,
    password: String, 
    signupMethod: String, 
  });
  
  const User = mongoose.model("User", userSchema);
  

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, email, countryCode, phone, password, signupMethod } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        let hashedPassword = "";
        if (signupMethod === "manual") {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            countryCode,
            phone,
            password: hashedPassword,
            signupMethod,
        });

        await newUser.save();
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Sign-in Route
// Sign-in Route
app.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User is not registered" });
        }

        // Determine sign-in method
        let signInMethod = user.signupMethod || "manual"; 

        // Compare passwords only for manual sign-ins
        if (signInMethod === "manual") {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: "Invalid email or password" });
            }
        }

        res.status(200).json({ message: "Login Successful", user, signInMethod });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});


  

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));