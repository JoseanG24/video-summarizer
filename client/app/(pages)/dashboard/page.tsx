"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const MainPage = () => {
  const [videoLink, setVideoLink] = useState("");
  const [transcription, setTranscription] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("transcription"); // Maneja pestañas

  // Obtiene la transcripción del video
  const handleSummarize = async () => {
    if (!videoLink) {
      alert("Please enter a video URL.");
      return;
    }

    try {
      setLoading(true);
      setTranscription("");
      setSummary("");

      const response = await fetch(
        // Usar en desarrollo
        // "http://localhost:8080/api/summarize",
// -----------------------------------------------------------------------------
        // Usar en producción
        "https://web-production-8432.up.railway.app/api/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoUrl: videoLink }),
        }
      );

      const data = await response.json();

      if (data.error) {
        console.error("Error fetching video:", data.error);
        setTranscription("Error processing the video. Please try again.");
      } else {
        setTranscription(data.transcription);
        sendTranscription(data.transcription);
      }
    } catch (error) {
      console.error("Error:", error);
      setTranscription("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Enviar transcripción al backend de OpenAI para resumir
  const sendTranscription = async (transcription: string) => {
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transcription }),
      });

      const result = await response.json();
      setSummary(result.summary);
    } catch (error) {
      console.error("Error sending transcription:", error);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-gray-900 text-white p-8">
      {/* Input para el link de YouTube */}
      <div className="flex flex-col items-center justify-center p-6">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold mb-4"
        >
          Paste Your Video Link
        </motion.h2>
        <motion.input
          type="text"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="w-3/4 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-md focus:ring-red-500 focus:border-red-500"
          placeholder="Enter video URL..."
        />
        <motion.button
          onClick={handleSummarize}
          disabled={loading}
          className={`mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition duration-300 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Processing..." : "Get Transcription"}
        </motion.button>
      </div>

      {/* Pestañas para cambiar entre Transcripción y Resumen */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setActiveTab("transcription")}
          className={`px-4 py-2 mx-2 rounded-md ${
            activeTab === "transcription" ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          Transcription
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`px-4 py-2 mx-2 rounded-md ${
            activeTab === "summary" ? "bg-red-500" : "bg-gray-700"
          }`}
        >
          Summary
        </button>
      </div>

      {/* Contenido de las pestañas */}
      <div className="mt-6 w-full flex flex-col items-center">
        {activeTab === "transcription" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-3/4 bg-gray-800 p-4 rounded-md text-gray-400 text-center"
          >
            <h2 className="text-xl font-bold text-white mb-3">Transcription</h2>
            <p>{transcription || "The transcription will appear here."}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-3/4 bg-gray-800 p-4 rounded-md text-gray-400 text-center"
          >
            <h2 className="text-xl font-bold text-white mb-3">Summary</h2>
            <p>{summary || "The summary will appear here."}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
