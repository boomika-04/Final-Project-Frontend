"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

export default function Analytics() {

  const router = useRouter();

  const [data, setData] = useState([]);
  const [top, setTop] = useState(null);
  const [trend, setTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ["#06b6d4", "#22c55e", "#f59e0b", "#ef4444"];

  useEffect(() => {

    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.replace("/login");
      return;
    }

    // ✅ FIXED: Added history API
    Promise.all([

      fetch("http://localhost:8082/api/admin/crop-stats",{
        headers:{ Authorization:`Bearer ${token}` }
      }).then(res=>res.json()),

      fetch("http://localhost:8082/api/admin/stats",{
        headers:{ Authorization:`Bearer ${token}` }
      }).then(res=>res.json()),

      fetch("http://localhost:8082/api/history",{   // 🔥 ADDED
        headers:{ Authorization:`Bearer ${token}` }
      }).then(res=>res.json())

    ])
    .then(([cropStats, stats, history]) => {   // 🔥 FIXED

      // 🔹 COUNT (NO CHANGE)
      const chartData = Object.keys(cropStats).map(crop => ({
        crop,
        count: cropStats[crop]
      }));

      setData(chartData);

      // 🔹 TREND (FIXED)
      const trendMap = {};
      history.forEach(item => {
        if(!item.createdAt) return;

        const date = item.createdAt.split("T")[0];
        trendMap[date] = (trendMap[date] || 0) + 1;
      });

      const trendData = Object.keys(trendMap)
        .map(date => ({
          date,
          count: trendMap[date]
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setTrend(trendData);

      // 🔹 TOP CROP (NO CHANGE)
      setTop({ crop: stats.topCrop });

      setLoading(false);

    })
    .catch(() => {
      setError("Failed to load analytics");
      setLoading(false);
    });

  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-cyan-400 text-xl">
        Loading Analytics...
      </div>
    );
  }
  if (!loading && data.length === 0 && trend.length === 0) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-gray-400 text-xl">
      📊 No analytics data yet <br/>
      Start predicting to see insights 🌱
    </div>
  );
}

  return (

    <div className="min-h-screen bg-[#020617] text-white p-10">

      {/* HEADER */}
      <div className="flex justify-between mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
          📊 Crop Analytics
        </h1>

        <button
          onClick={() => router.back()}
          className="bg-blue-500 px-5 py-2 rounded-lg shadow hover:bg-amber-900 hover:scale-105 transition cursor-pointer"
        >
          ⬅ Back
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/40 border border-red-400 rounded-xl">
          ❌ {error}
        </div>
      )}

      {/* TOP CROP */}
      {top && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 p-5 bg-gradient-to-br from-green-900/40 to-green-800/30 
          border border-green-400/40 rounded-2xl shadow"
        >
          🥇 Top Crop: <span className="font-bold">{top.crop}</span>
        </motion.div>
      )}

      {/* CHARTS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >

        {/* BAR */}
        <motion.div variants={item}
          className="bg-gradient-to-br from-slate-900 to-slate-800 
          p-6 rounded-2xl border border-cyan-400/30 
          shadow-[0_0_30px_rgba(0,255,255,0.15)]">

          <h2 className="mb-4 text-cyan-400 font-semibold">
            Most Predicted Crops
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="crop" stroke="#94a3b8"/>
              <YAxis stroke="#94a3b8"/>
              <Tooltip contentStyle={{ backgroundColor:"#020617", border:"1px solid cyan" }}/>
              <Bar dataKey="count" fill="#06b6d4" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </motion.div>

        {/* LINE */}
        <motion.div variants={item}
          className="bg-gradient-to-br from-slate-900 to-slate-800 
          p-6 rounded-2xl border border-cyan-400/30 
          shadow-[0_0_30px_rgba(0,255,255,0.15)]">

          <h2 className="mb-4 text-cyan-400 font-semibold">
            Prediction Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid stroke="#334155" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#94a3b8"/>
              <YAxis stroke="#94a3b8"/>
              <Tooltip contentStyle={{ backgroundColor:"#020617", border:"1px solid cyan" }}/>
              <Line type="monotone" dataKey="count" stroke="#22c55e" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>

        </motion.div>

        {/* PIE */}
        <motion.div variants={item}
          className="bg-gradient-to-br from-slate-900 to-slate-800 
          p-6 rounded-2xl border border-cyan-400/30 
          shadow-[0_0_30px_rgba(0,255,255,0.15)]">

          <h2 className="mb-4 text-cyan-400 font-semibold">
            Crop Distribution
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="crop"
                outerRadius={100}
                label
              >
                {data.map((item, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor:"#020617", border:"1px solid cyan" }}/>
            </PieChart>
          </ResponsiveContainer>

        </motion.div>

      </motion.div>

    </div>
  );
}