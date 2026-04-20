"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { FaUsers, FaChartLine, FaSeedling, FaBrain, FaBell } from "react-icons/fa";
import ModelPerformance from "../components/ModelPerformance";

export default function Admin(){

const router = useRouter();

const [stats,setStats] = useState({
users:0,
totalPredictions:0,
topCrop:"-"
});

const [accuracy,setAccuracy] = useState(0);
const [chart,setChart] = useState([]);
const [history,setHistory] = useState([]);
const [loading,setLoading] = useState(true);
const [notifications, setNotifications] = useState([]);
const [showNotif, setShowNotif] = useState(false);

useEffect(()=>{

const token = localStorage.getItem("accessToken");

if(!token){
router.replace("/login");
return;
}

try{
const payload = JSON.parse(atob(token.split(".")[1]));
if(payload.role !== "ADMIN"){
router.replace("/");
}
}catch(e){
router.replace("/login");
}

Promise.all([
fetch("http://localhost:8082/api/admin/stats",{headers:{ Authorization:`Bearer ${token}` }}).then(res=>res.json()),
fetch("http://localhost:8082/api/model-performance",{headers:{ Authorization:`Bearer ${token}` }}).then(res=>res.json()),
fetch("http://localhost:8082/api/history",{headers:{ Authorization:`Bearer ${token}` }}).then(res=>res.json()),
fetch("http://localhost:8082/api/admin/notifications",{
    headers:{ Authorization:`Bearer ${token}` }
  }).then(res=>res.json()),
fetch("http://localhost:8082/api/admin/crop-stats", {
  headers:{ Authorization:`Bearer ${token}` }
}).then(res=>res.json())
]).then(([statsData,modelData,historyData,notifData,cropStats])=>{

setStats(statsData);
setAccuracy(modelData.accuracy);
setNotifications(notifData);

// sort latest
const sorted = historyData.sort((a,b)=> new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
setHistory(sorted);

// remove empty crop + count
let chartData = Object.keys(cropStats).map(crop => ({
  crop,
  count: cropStats[crop]
}));

// 🔥 "Other" 
chartData.sort((a,b)=>{
if(a.crop.toLowerCase()==="other") return 1;
if(b.crop.toLowerCase()==="other") return -1;
return b.count - a.count;
});

setChart(chartData);
setLoading(false);

});

},[]);

const container = {
hidden:{opacity:0},
show:{opacity:1,transition:{staggerChildren:0.2}}
};

const item = {
hidden:{opacity:0,y:20},
show:{opacity:1,y:0}
};

if(loading){
return (
<div className="min-h-screen flex items-center justify-center bg-[#020617] text-cyan-400 text-xl">
Loading Admin Dashboard...
</div>
);
}

const recent = history.slice(0,5);

const formatTime = (t)=>{
if(!t) return "Just now";
const diff = Math.floor((Date.now()-new Date(t))/60000);
if(diff<1) return "Just now";
if(diff<60) return `${diff} mins ago`;
return `${Math.floor(diff/60)} hrs ago`;
};

// insight
const topInsight = stats.topCrop;

return(

<div className="min-h-screen bg-[#020617] text-white p-10">

{/* HEADER */}
<div className="flex justify-between items-center mb-10">

<h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
👑 Admin Dashboard
</h1>

<div className="flex items-center gap-4">
<div 
  className="bg-slate-800 p-3 rounded-full cursor-pointer"
  onClick={() => setShowNotif(!showNotif)}
>
  <FaBell />
</div>

 {/* 🔥 ADD THIS BELOW BELL */}
  {showNotif && (
  <div className="absolute top-16 right-20 bg-slate-900 
  border border-cyan-400/30 p-4 rounded-xl w-72 shadow-lg">

    <p className="text-cyan-400 font-semibold mb-2">
      🔔 Notifications
    </p>

    {notifications.length === 0 ? (
      <p className="text-gray-400 text-sm">No notifications</p>
    ) : (
      notifications.map((n, i) => (
        <p key={i} className="text-sm text-gray-300 mt-2">
          ✔ {n}
        </p>
      ))
    )}

  </div>
)}


{/* 🔥 GIRL ANIMATED IMAGE */}
<img
src="https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif"
className="w-10 h-10 rounded-full border border-cyan-400 object-cover"
/>

<button
onClick={()=>router.back()}
className="bg-blue-500 px-5 py-2 rounded-lg hover:bg-amber-800 transition cursor-pointer"
>
⬅ Back
</button>
</div>

</div>

{/* STATS */}
<motion.div
variants={container}
initial="hidden"
animate="show"
className="grid grid-cols-2 gap-8 mb-10"
>

<motion.div variants={item} className="p-6 bg-slate-900 rounded-2xl border border-cyan-400/30">
<FaUsers className="text-cyan-400"/> Total Users
<p className="text-3xl mt-3">{stats.users}</p>
</motion.div>

<motion.div variants={item} className="p-6 bg-slate-900 rounded-2xl border border-cyan-400/30">
<FaChartLine className="text-green-400"/> Total Predictions
<p className="text-3xl mt-3">{stats.totalPredictions}</p>
</motion.div>

<motion.div variants={item} className="p-6 bg-slate-900 rounded-2xl border border-cyan-400/30">
<FaSeedling className="text-yellow-400"/> Top Crop
<p className="text-3xl mt-3">{stats.topCrop}</p>
</motion.div>

<motion.div variants={item} className="p-6 bg-slate-900 rounded-2xl border border-cyan-400/30">
<FaBrain className="text-purple-400"/> Accuracy
<p className="text-3xl mt-3">{accuracy?.toFixed(2)}%</p>
</motion.div>

</motion.div>

{/* MAIN */}
<div className="grid grid-cols-3 gap-8">

<div className="col-span-2 space-y-8">

{/* CHART */}
<div className="bg-slate-900 p-6 rounded-2xl border border-cyan-400/30">
<h2 className="text-cyan-400 mb-4">📊 Crop Prediction Chart</h2>

<ResponsiveContainer width="100%" height={320}>
<BarChart data={chart}>
<CartesianGrid stroke="#334155" strokeDasharray="3 3" />
<XAxis dataKey="crop"/>
<YAxis/>
<Tooltip/>
<Bar dataKey="count" fill="#06b6d4" />
</BarChart>
</ResponsiveContainer>
</div>

{/* RECENT */}
<div className="bg-slate-900 p-6 rounded-2xl border border-cyan-400/30">
<h2 className="text-cyan-400 mb-4">✔ Recent Predictions</h2>

<table className="w-full text-left">
<thead>
<tr className="text-gray-400">
<th>Id</th>
<th>Crop</th>
<th>Confidence</th>
<th>Time</th>
</tr>
</thead>

<tbody>
{recent.map((r,i)=>(
<tr key={i} className="border-t border-gray-700">
<td>{r.id || i+1}</td>
<td>{r.crop}</td>
<td>{r.confidence?.toFixed(1)}%</td>
<td>{formatTime(r.createdAt)}</td>
</tr>
))}
</tbody>
</table>

<p
onClick={()=>router.push("/history")}
className="text-right text-cyan-400 mt-3 cursor-pointer"
>
View All →
</p>

</div>

 <ModelPerformance />

</div>

{/* RIGHT */}
<div className="space-y-8">

{/* INSIGHT */}
<div className="bg-slate-900 p-6 rounded-2xl border border-cyan-400/30">
<h2 className="text-yellow-400">💡 Smart Insight</h2>
<p className="mt-3 text-gray-300">
Based on usage, <span className="text-cyan-400">{topInsight}</span> is most predicted.
</p>
</div>

{/* PROFILE */}
<div className="bg-slate-900 p-6 rounded-2xl border border-cyan-400/30 flex items-center gap-4">
<img src="https://media.giphy.com/media/10SvWCbt1ytWCc/giphy.gif" className="w-14 h-14 rounded-full object-cover"/>
<div>
<h3 className="text-lg font-semibold">Welcome, Boomika!</h3>
<p className="text-sm text-gray-400">boomika31052004@gmail.com</p>
<p className="text-xs text-gray-500">Role: Admin</p>
</div>
</div>
{/* 🔥 NEW FILL CARD */}
<div className="bg-slate-900 p-6 rounded-2xl border border-cyan-400/30">
<h2 className="text-cyan-400">⚡ System Status</h2>
<p className="text-gray-400 mt-2">Server: Online</p>
<p className="text-gray-400">API: Connected</p>
<p className="text-gray-400">Last Sync: Just now</p>
</div>


</div>

</div>

</div>

);
}