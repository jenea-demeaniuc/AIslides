require('dotenv').config();
const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json()); // To parse JSON request bodies
app.use(express.static('public')); // Serve static files (your HTML, CSS, JS)

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/generate', async (req, res) => {
    try {
        const { title, content } = req.body;

        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: `${title}: ${content}` }],
        });
        const generatedText = completion.data.choices[0].message.content;

        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(title)}`;
        const imageResponse = await fetch(imageUrl);
        const imageBlob = await imageResponse.blob();
        const arrayBuffer = await imageBlob.arrayBuffer();
        const imageBase64 = Buffer.from(arrayBuffer).toString('base64');
        const imageData = `data:${imageBlob.type};base64,${imageBase64}`;

        res.json({ text: generatedText, image: imageData });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: 'Error generating presentation.' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});