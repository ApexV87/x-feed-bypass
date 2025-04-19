const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();

app.get("/tweets", async (req, res) => {
    try {
        const username = req.query.user || "ReaganBoxGA";
        const url = `https://nitter.net/${username}`;
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const tweets = [];

        $(".timeline-item").each((i, el) => {
            const text = $(el).find(".tweet-content").text().trim();
            const date = $(el).find(".tweet-date a").attr("title");
            tweets.push({ text, date });
        });

        res.json({ tweets });
    } catch (err) {
        res.status(500).json({ error: "Failed to load tweets" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
