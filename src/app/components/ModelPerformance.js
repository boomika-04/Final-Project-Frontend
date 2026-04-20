"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ModelPerformance() {

  const [data, setData] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8082/api/model-performance", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Not authorized");
      }
      return res.json();
    })
    .then(data => setData(data))
    .catch(err => console.error("MODEL ERROR:", err));

  }, []);

  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#0f172a] to-[#020617]
      p-8 rounded-2xl shadow-2xl border border-cyan-400/30
      max-w-5xl mx-auto mt-10"
    >

      {/* TITLE */}
      <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">
        📊 Model Performance
      </h2>

      {/* METRICS */}
      <div className="grid grid-cols-2 gap-4 text-lg">

        <p>Accuracy:</p>
        <p className="text-green-400 font-semibold">
          {data.accuracy?.toFixed(2)}%
        </p>

        <p>Precision:</p>
        <p className="text-blue-400 font-semibold">
          {data.precision?.toFixed(3)}
        </p>

        <p>Recall:</p>
        <p className="text-yellow-400 font-semibold">
          {data.recall?.toFixed(3)}
        </p>

        <p>F1 Score:</p>
        <p className="text-pink-400 font-semibold">
          {data.f1Score?.toFixed(3)}
        </p>

      </div>

      {/* CONFUSION MATRIX */}
      {data.confusionMatrix && (
        <div className="mt-8">
          
          <h3 className="text-lg text-cyan-300 mb-3 text-center">
            Confusion Matrix
          </h3>

          {/* 🔥 FIX: scroll + container */}
          <div className="overflow-x-auto rounded-xl border border-cyan-500/30 p-3">

            <table className="border border-gray-600 text-center min-w-max">

              <tbody>
                {data.confusionMatrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className="border border-gray-700 px-3 py-2 text-sm"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>

            </table>

          </div>

        </div>
      )}

    </motion.div>
  );
}