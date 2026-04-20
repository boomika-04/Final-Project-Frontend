"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function History(){

const router = useRouter();
const [history,setHistory] = useState([]);
const [loading,setLoading] = useState(true);

useEffect(()=>{

const token = localStorage.getItem("accessToken");

if(!token){
router.push("/login");
return;
}

fetch("http://localhost:8082/api/history",{
headers:{
Authorization:`Bearer ${token}`
}
})
.then(async res => {
if(!res.ok){
  throw new Error("API ERROR: " + res.status);
}
return res.json();
})
.then(data=>{
setHistory(data);
setLoading(false);
})
.catch(err=>{
console.error("HISTORY ERROR:",err);
setLoading(false);
});

},[]);

const deletePrediction = async(id) => {

const token = localStorage.getItem("accessToken");

await fetch(`http://localhost:8082/api/history/${id}`,{
method:"DELETE",
headers:{
Authorization:`Bearer ${token}`
}
});

setHistory(prev => prev.filter(item => item.id !== id));
};

if(loading){
return (
<div className="min-h-screen flex items-center justify-center bg-[#020617] text-cyan-400 text-xl">
Loading History...
</div>
);
}

return (

<div className="min-h-screen bg-[#020617] text-white p-10">

{/* HEADER */}
<div className="flex justify-between mb-8">

<h1 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
📜 Prediction History
</h1>

<button
onClick={() => router.push("/")}
className="px-5 py-2 rounded-lg font-semibold bg-blue-500 text-white hover:bg-amber-800 hover:scale-105 transition-shadow cursor-pointer"
>
⬅ Back
</button>

</div>

{/* EMPTY */}
{history.length === 0 ? (

<p className="text-center text-gray-400">
No predictions yet.
</p>

) : (

<motion.div
initial={{opacity:0,y:20}}
animate={{opacity:1,y:0}}
className="overflow-x-auto rounded-2xl border border-cyan-400/30 
shadow-[0_0_30px_rgba(0,255,255,0.15)]"
>

<table className="w-full">

<thead className="bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-300">
<tr>
<th className="p-4 text-left">Crop</th>
<th className="p-4 text-left">Confidence</th>
<th className="p-4 text-left">Date</th>
<th className="p-4 text-center">Action</th>
</tr>
</thead>

<tbody>

{history.map((item,index)=>(

<motion.tr
key={index}
whileHover={{ 
  backgroundColor:"#0f172a",
  scale:1.01
}}
className="border-t border-cyan-700/30 transition"
>

<td className="p-4 font-semibold text-green-300">
🌾 {item.crop}
</td>

<td className="p-4 text-cyan-300">
{item.confidence?.toFixed(2)}%
</td>

<td className="p-4 text-gray-400">
{new Date(item.createdAt).toLocaleString()}
</td>

<td className="p-4 text-center">
<button
onClick={() => deletePrediction(item.id)} 
className="bg-red-500 px-4 py-1 rounded-lg font-semibold 
transition-all duration-300 shadow
hover:scale-105 hover:bg-red-600 cursor-pointer
hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]"
>
Delete
</button>
</td>

</motion.tr>

))}

</tbody>

</table>

</motion.div>

)}

</div>

);

}