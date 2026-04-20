"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function About() {

  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#020617] text-white px-6 py-16 relative overflow-hidden">

      {/* 🌿 LEAVES */}
      <motion.img
        src="/leaf.png"
        className="absolute w-28 top-10 left-10 opacity-80"
        animate={{ y: [0, 50, 0], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.img
        src="/leaf.png"
        className="absolute w-32 bottom-10 right-10 opacity-80"
        animate={{ y: [0, -60, 0], rotate: [0, -25, 25, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* BACK */}
      <button
        onClick={() => router.push("/home")}
        className="mb-12 bg-blue-500 px-6 py-3 text-lg rounded-lg hover:bg-amber-600 transition shadow cursor-pointer"
      >
        ⬅ Back
      </button>

      {/* 🔥 TITLE */}
      <div className="text-center mb-20">
        <h1 className="text-6xl font-bold tracking-wide 
        bg-gradient-to-r from-cyan-400 to-blue-500 
        text-transparent bg-clip-text">
          AGRI INSIGHT HUB
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Smart Crop Recommendation System 🌾
        </p>
      </div>

      {/* TIMELINE */}
      <div className="relative max-w-6xl mx-auto">

        {/* LINE */}
        <div className="absolute left-1/2 top-0 w-1 h-full 
        bg-gradient-to-b from-cyan-500 to-blue-500/30 
        transform -translate-x-1/2"></div>

        {/* DESCRIPTION */}
        <motion.div initial={{opacity:0,x:-120}} animate={{opacity:1,x:0}} transition={{delay:0.1}}
          className="mb-20 flex justify-start">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">🌾 Description</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              This system uses Machine Learning to recommend crops 
              based on soil nutrients, climate conditions, and environmental factors.
            </p>
          </div>
        </motion.div>

        {/* PROBLEM */}
        <motion.div initial={{opacity:0,x:120}} animate={{opacity:1,x:0}} transition={{delay:0.2}}
          className="mb-20 flex justify-end">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">⚠ Problem</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Farmers often lack proper knowledge about soil nutrients and weather,
              leading to poor crop selection and low productivity.
            </p>
          </div>
        </motion.div>

        {/* SOLUTION */}
        <motion.div initial={{opacity:0,x:-120}} animate={{opacity:1,x:0}} transition={{delay:0.3}}
          className="mb-20 flex justify-start">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">💡 Solution</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Our system provides intelligent crop suggestions using AI,
              helping farmers choose the best crop for maximum yield.
            </p>
          </div>
        </motion.div>

        {/* FEATURES */}
        <motion.div initial={{opacity:0,x:120}} animate={{opacity:1,x:0}} transition={{delay:0.4}}
          className="mb-20 flex justify-end">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">✨ Features</h2>
            <ul className="text-gray-300 text-lg space-y-2">
              <li>✔ Crop prediction using Random Forest</li>
              <li>✔ Voice input 🎙️</li>
              <li>✔ Prediction history 📜</li>
              <li>✔ Admin analytics 📊</li>
              <li>✔ Secure login 🔐</li>
            </ul>
          </div>
        </motion.div>

        {/* TECHNOLOGY */}
        <motion.div initial={{opacity:0,x:-120}} animate={{opacity:1,x:0}} transition={{delay:0.5}}
          className="mb-20 flex justify-start">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">⚙ Technologies</h2>
            <ul className="text-gray-300 text-lg space-y-2">
              <li>✔ Next.js + Tailwind CSS</li>
              <li>✔ Spring Boot (Java)</li>
              <li>✔ Machine Learning (WEKA)</li>
              <li>✔ JWT Authentication</li>
            </ul>
          </div>
        </motion.div>

        {/* BENEFITS */}
        <motion.div initial={{opacity:0,x:120}} animate={{opacity:1,x:0}} transition={{delay:0.6}}
          className="mb-20 flex justify-end">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">🌱 Benefits</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Helps farmers increase productivity, reduce risk, 
              and improve crop yield using smart decisions.
            </p>
          </div>
        </motion.div>

        {/* FUTURE */}
        <motion.div initial={{opacity:0,x:-120}} animate={{opacity:1,x:0}} transition={{delay:0.7}}
          className="mb-20 flex justify-start">
          <div className="bg-white/5 p-10 rounded-2xl w-[48%] border border-white/10 shadow-2xl hover:scale-105 transition">
            <h2 className="text-cyan-400 text-2xl mb-4 font-semibold">🚀 Future Scope</h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              Future improvements include weather API integration,
              mobile app development, and IoT-based soil monitoring.
            </p>
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="mt-24 text-center text-gray-400 text-base">
        Empowering farmers with smart crop recommendations 🌾
      </div>

    </div>
  );
}