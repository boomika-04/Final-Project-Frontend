"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {

  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen relative overflow-hidden 
      bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#020617] 
      text-white px-6 py-16"
    >

      {/* 🌿 FLOATING LEAVES */}
      <motion.img
        src="/leaf.png"
        className="absolute w-20 top-10 left-10 opacity-70"
        animate={{ y: [0, 30, 0], rotate: [0, 20, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.img
        src="/leaf.png"
        className="absolute w-24 bottom-10 right-10 opacity-70"
        animate={{ y: [0, -30, 0], rotate: [0, -20, 20, 0] }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      <motion.img
        src="/leaf.png"
        className="absolute w-16 top-1/2 left-0 opacity-50"
        animate={{ x: [0, 40, 0], rotate: [0, 15, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* 🔥 BIG HOME TITLE */}
      <div className="text-center mb-14">
        <h1 className="text-5xl font-bold tracking-wide 
        bg-gradient-to-r from-cyan-400 to-blue-500 
        text-transparent bg-clip-text mb-3">
          Overview
        </h1>

        <h2 className="text-3xl font-semibold mb-3">
          🌾 Smart Crop Recommendation System
        </h2>

        <p className="text-gray-400">
          Intelligent system to guide farmers using data-driven insights
        </p>
      </div>

      {/* MAIN CARDS */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.2
            }
          }
        }}
        className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
      >

        {/* 🌾 PREDICT */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ scale: 1.08, y: -8 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-green-400 via-emerald-500 to-lime-500 
          p-8 rounded-2xl shadow-2xl cursor-pointer text-center
          hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition"
          onClick={() => router.push("/")}
        >
          <h2 className="text-4xl mb-3">🌾</h2>
          <h3 className="text-xl font-semibold mb-2">Predict Crop</h3>
          <p className="text-white/90 text-sm">
            Get best crop based on soil & climate data
          </p>
        </motion.div>

        {/* ℹ️ ABOUT */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ scale: 1.08, y: -8 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-500 
          p-8 rounded-2xl shadow-2xl cursor-pointer text-center
          hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition"
          onClick={() => router.push("/about")}
        >
          <h2 className="text-4xl mb-3">ℹ️</h2>
          <h3 className="text-xl font-semibold mb-2">Project Info</h3>
          <p className="text-white/90 text-sm">
            Learn about system & technologies
          </p>
        </motion.div>

        {/* 🚪 LOGOUT */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0 }
          }}
          whileHover={{ scale: 1.08, y: -8 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 
          p-8 rounded-2xl shadow-2xl cursor-pointer text-center
          hover:shadow-[0_0_30px_rgba(239,68,68,0.7)] transition"
          onClick={handleLogout}
        >
          <h2 className="text-4xl mb-3">🚪</h2>
          <h3 className="text-xl font-semibold mb-2">Logout</h3>
          <p className="text-white/90 text-sm">
            Securely sign out from system
          </p>
        </motion.div>

      </motion.div>

      {/* FOOTER */}
      <div className="mt-24 text-center text-gray-500 text-sm">
        Empowering farmers with smart crop recommendations 🌾
      </div>

    </motion.div>
  );
}