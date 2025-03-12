// server.js
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const {GoogleGenerativeAI}=require ('@google/generative-ai');
const axios = require('axios');
const app = express();
const fs=require('fs');
const { MIMEType } = require('util');
const PORT = 5000;
const cors=require("cors")


// Get your Gemini AI API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY; 
const GEMINI_API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
 const genAI=new GoogleGenerativeAI('AIzaSyC-BSufXQFtpyAD6G0MC2yYISnFrvj8oS8')
 const model=genAI.getGenerativeModel({
    model:"gemini-1.5-flash"
 })
// Middleware to parse JSON
app.use(express.json());
app.use(cors({
    origin:"*",
    methods:["POST"]
}))
console.log('Node is working!');

// Route to interact with Gemini AI
app.post('/gemini-query', async (req, res) => {
    try {
        const userInput = req.body.input;

        // Check for empty input
        if (!userInput) {
            return res.status(400).json({ error: 'Input is required.' });
        }

        console.log(`User Input: ${userInput}`);

const response1=await model.generateContent(
    userInput
)
const reply =response1.response.text()
       console.log(reply)

        return res.status(201).json({
            message:reply
        }); // Send the response data back to the client
    } catch (error) {
        console.error('Error interacting with Gemini:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});
app.post("/image",async(req,res)=>{
    const userInput = req.body.input;

    // Check for empty input
    if (!userInput) {
        return res.status(400).json({ error: 'Input is required.' });
    }

    console.log(`User Input: ${userInput}`);
const image={inlineData:{
    data:Buffer.from(fs.readFileSync("tiger.png")).toString("base64"),
    mimeType:"image/png"
}}
const result =await model.generateContent([userInput,image])
const reply =result.response.text()
       console.log(reply)
        res.json(reply); 
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
