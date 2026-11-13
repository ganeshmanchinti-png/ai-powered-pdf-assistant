import { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("pdf");

  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // PDF Upload
  const uploadPDF = async () => {
    if (!file) return;

    setLoading(true);
    setMessage("");
    setAnswer("");

    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail);
      }

      setMessage(data.message || "PDF uploaded successfully!");
    } catch (error) {
      setMessage(error.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // PDF Question
  const askPDF = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail);
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Web Search
  const searchWeb = async () => {
    setLoading(true);
    setAnswer("");

    try {
      const response = await fetch("http://localhost:5000/web-search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail);
      }

      setAnswer(data.answer);
    } catch (error) {
      setAnswer(error.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  // Send Button
  const handleSubmit = () => {
    if (!question.trim() || loading) return;

    if (activeTab === "pdf") {
      askPDF();
    } else {
      searchWeb();
    }
  };

  // Change Tab
  const changeTab = (tab) => {
    setActiveTab(tab);
    setAnswer("");
    setMessage("");
    setQuestion("");
  };

  return (
    <div className="app-container">
      <div className="chat-card">
        {/* Header */}
        <div className="header">
          <div className="logo">AI</div>

          <h1>AI Assistant</h1>

          <p>Ask anything, get intelligent answers</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "pdf" ? "tab active" : "tab"}
            onClick={() => changeTab("pdf")}
          >
            📄 PDF Chat
          </button>

          <button
            className={activeTab === "web" ? "tab active" : "tab"}
            onClick={() => changeTab("web")}
          >
            🌐 Web Search
          </button>
        </div>

        {/* PDF Upload */}
        {activeTab === "pdf" && (
          <div className="section">
            <h3>Upload your PDF</h3>

            <label className="upload-box">
              <span className="upload-icon">📁</span>

              <span>{file ? file.name : "Choose PDF File"}</span>

              <small>PDF files only</small>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => {
                  setFile(e.target.files[0] || null);
                  setMessage("");
                  setAnswer("");
                }}
              />
            </label>

            <button
              className="upload-btn"
              onClick={uploadPDF}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload PDF"}
            </button>

            {message && <p className="message">{message}</p>}
          </div>
        )}

        {/* Question */}
        <div className="section">
          <h3>
            {activeTab === "pdf" ? "Ask your PDF" : "Search the Internet"}
          </h3>

          <div className="question-box">
            <input
              type="text"
              placeholder={
                activeTab === "pdf"
                  ? "Ask something about your PDF..."
                  : "What do you want to search?"
              }
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            <button
              onClick={handleSubmit}
              disabled={!question.trim() || loading}
            >
              {loading ? "..." : "➤"}
            </button>
          </div>
        </div>

        {/* Answer */}
        <div className="answer-box">
          <h3>💡 AI Answer</h3>

          {loading ? (
            <div className="loader">
              <div className="spinner"></div>
              <p>AI is thinking...</p>
            </div>
          ) : (
            <p>{answer || "Your answer will appear here..."}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
