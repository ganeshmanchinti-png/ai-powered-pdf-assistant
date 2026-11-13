const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// Store PDF Text
let pdfText = "";

// PDF Upload API
app.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    const data = await pdf(req.file.buffer);

    pdfText = data.text;

    res.json({
      message: "PDF uploaded successfully",
    });
  } catch (error) {
    res.status(400).json({
      error: "PDF upload failed",
    });
  }
});

// PDF Question API
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!pdfText) {
      return res.status(400).json({
        error: "Please upload PDF first",
      });
    }

    const response = await axios.post("http://127.0.0.1:8000/chat", {
      context: pdfText,
      question: question,
    });

    res.json({
      answer: response.data.answer,
    });
  } catch (error) {
    res.status(400).json({
      error: "Python server error",
    });
  }
});

// Web Search API
app.post("/web-search", async (req, res) => {
  try {
    const { question } = req.body;

    // Send question to Python
    const response = await axios.post("http://127.0.0.1:8000/web-search", {
      question: question,
    });

    res.json({
      answer: response.data.answer,
    });
  } catch (error) {
    res.status(400).json({
      error: "Web search failed",
    });
  }
});

// Server
app.listen(5000, () => {
  console.log("Node server running on port 5000");
});
