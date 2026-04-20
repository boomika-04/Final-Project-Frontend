"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {

const router = useRouter();
const [mounted, setMounted] = useState(false);
const [phone, setPhone] = useState("");
const [otp, setOtp] = useState("");
const [otpSent, setOtpSent] = useState(false);
const [showPhoneLogin, setShowPhoneLogin] = useState(false);

useEffect(() => setMounted(true), []);
if (!mounted) return null;

const handleGoogleLogin = () => {
window.location.href = "http://localhost:8082/oauth2/authorization/google";
};

// ---------------- SEND OTP ----------------
const sendOTP = async () => {
try {
if (!/^[6-9]\d{9}$/.test(phone)) return alert("Enter valid number");

const res = await fetch("http://localhost:8082/auth/send-otp", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ phone })
});

if(!res.ok){
  throw new Error("OTP send failed");
}

const data = await res.json();
alert("OTP: " + data.otp);
setOtpSent(true);

} catch (err) {
console.error(err);
alert("OTP send failed");
}
};

// ---------------- VERIFY OTP ----------------
const verifyOTP = async () => {
if (!otp.trim()) return alert("Enter OTP");

const cleanPhone = phone.replace(/\D/g, "");

try{
const res = await fetch("http://localhost:8082/auth/verify-otp", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ phone: cleanPhone, otp: otp.trim() })
});

let data = {};
try {
  data = await res.json();
} catch {}

if (!res.ok) {
  alert(data.error || "Invalid OTP");
  return;
}

if (!data.accessToken || !data.refreshToken) {
  alert("Login failed");
  return;
}

// ✅ SAVE TOKEN

localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("refreshToken", data.refreshToken);

// ---------------- LINK PHONE (FIXED LOGIC) ----------------
const email = prompt("Enter your email to link (optional)");

// ❌ user pressed CANCEL → skip
if (email === null) {
  router.push("/");
  return;
}

// ❌ user pressed OK but empty → block
if (!email.trim()) {
  alert("Enter email or press Cancel to skip");
  return;
}

// ✅ valid email → link
try {
  const linkRes = await fetch("http://localhost:8082/auth/link-phone", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      phone: cleanPhone,
      email: email.trim()
    })
  });

  if (linkRes.ok) {
    console.log("PHONE LINKED");
  }

} catch (e) {
  console.log("Link error", e);
}

// ✅ AFTER LINK → HOME
router.push("/");

} catch (err) {
console.error(err);
alert("Verify failed");
}
};

return (

<div
className="min-h-screen flex items-center justify-center relative overflow-hidden font-[Poppins]"
style={{ backgroundImage: "url('/crop1.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
>

{/* overlay */}
<div className="absolute inset-0 bg-gradient-to-br from-[#050816]/50 via-[#0b0f2a]/50 to-black/50"></div>

{/* 🌿 SIDE LEAVES */}
<motion.img
src="/leaf.png"
className="absolute left-0 top-0 h-full opacity-30"
animate={{ y: [0, -20, 0] }}
transition={{ duration: 8, repeat: Infinity }}
/>

<motion.img
src="/leaf.png"
className="absolute right-0 top-0 h-full opacity-30 scale-x-[-1]"
animate={{ y: [0, -25, 0] }}
transition={{ duration: 9, repeat: Infinity }}
/>

{/* 🌿 FLOATING LEAVES */}
{[...Array(8)].map((_, i) => (
<motion.img
key={i}
src="/leaf.png"
className="absolute w-6 opacity-40"
style={{
top: `${20 + i * 8}%`,
left: i % 2 === 0 ? "18%" : "78%"
}}
animate={{
y: [0, -15, 0],
rotate: [0, 15, 0]
}}
transition={{
duration: 4 + i,
repeat: Infinity
}}
/>
))}

{/* CARD */}
<motion.div
initial={{ opacity: 0, scale: 0.85 }}
animate={{ opacity: 1, scale: 1 }}
transition={{ duration: 0.5 }}
className="relative z-10 w-[900px] h-[340px] rounded-2xl overflow-hidden
bg-white/5 backdrop-blur-xl border border-white/10"
style={{
boxShadow: "0 20px 60px rgba(0,0,0,0.9)"
}}
>

{/* animated border */}
<motion.div
className="absolute inset-0 rounded-2xl"
animate={{
background: [
"linear-gradient(120deg,#ff4ecd,#00eaff)",
"linear-gradient(240deg,#00eaff,#ff4ecd)"
]
}}
transition={{ duration: 6, repeat: Infinity }}
style={{ opacity: 0.2 }}
></motion.div>

{/* center line */}
<div
className="absolute left-1/2 top-[-60px] w-[2px] h-[500px]"
style={{
background: "linear-gradient(to bottom,#ff4ecd,#00eaff)",
transform: "translateX(-50%) rotate(18deg)",
boxShadow: "0 0 15px #00eaff"
}}
></div>

<div className="flex h-full relative z-10">

{/* LEFT */}
<div className="w-1/2 flex flex-col justify-center items-center text-white text-center px-8">

<motion.h1
animate={{ scale: [1, 1.08, 1] }}
transition={{ duration: 3, repeat: Infinity }}
className="text-5xl font-extrabold mb-2 tracking-[0.2em]
bg-gradient-to-r from-pink-400 to-cyan-400 text-transparent bg-clip-text drop-shadow-xl"
>
WELCOME
</motion.h1>

{/* 🌿 TEXT + SMALL LEAF */}
<div className="flex items-center gap-2 mt-2">

<p className="opacity-80 text-base tracking-wide">
Smart Crop Recommendation System
</p>

<motion.img
src="/leaf.png"
className="w-5 h-5"
animate={{
y: [0, -5, 0],
rotate: [0, 10, -10, 0],
scale: [1, 1.1, 1]
}}
transition={{
duration: 3,
repeat: Infinity
}}
/>

</div>

</div>

{/* RIGHT */}
<div className="w-1/2 flex flex-col justify-center px-8 text-white">

<h2 className="text-3xl mb-4 font-bold tracking-[0.25em] text-center pr-2
bg-gradient-to-r from-cyan-300 to-blue-400 text-transparent bg-clip-text drop-shadow-lg">
LOGIN
</h2>

<motion.button
onClick={handleGoogleLogin}
whileHover={{ scale: 1.06 }}
whileTap={{ scale: 0.95 }}
className="w-full py-2.5 rounded-lg mb-3 text-base font-semibold cursor-pointer tracking-wide
bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg 
flex items-center justify-center gap-3"
>

<img src="/google.png" className="w-5 h-5" />

<span>Sign in with Google</span>

</motion.button>


{!showPhoneLogin && (
<motion.button
onClick={()=>setShowPhoneLogin(true)}
whileHover={{ scale: 1.06 }}
whileTap={{ scale: 0.95 }}
className="w-full py-2.5 rounded-lg text-base font-semibold cursor-pointer tracking-wide
bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg"
>
📱 Sign in with Phone Number
</motion.button>
)}

<AnimatePresence>
{showPhoneLogin && !otpSent && (
<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
<input
type="text"
placeholder="Enter Phone Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
className="w-full p-2.5 text-base rounded-lg bg-white/10 border border-white/20 mt-3
focus:ring-2 focus:ring-cyan-400 outline-none"
/>

<button
onClick={sendOTP}
className="w-full bg-cyan-500 py-2.5 rounded-lg mt-2 text-base font-semibold cursor-pointer hover:bg-cyan-600 transition"
>
Send OTP
</button>
</motion.div>
)}
</AnimatePresence>

<AnimatePresence>
{otpSent && (
<motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
<input
type="text"
placeholder="Enter OTP"
value={otp}
onChange={(e)=>setOtp(e.target.value)}
className="w-full p-2.5 text-base rounded-lg bg-white/10 border border-white/20 mt-3
focus:ring-2 focus:ring-green-400 outline-none"
/>

<button
onClick={verifyOTP}
className="w-full bg-green-500 py-2.5 rounded-lg mt-2 text-base  hover:bg-green-400 cursor-pointer transition"
>
Verify OTP
</button>
</motion.div>
)}
</AnimatePresence>

</div>

</div>

</motion.div>

</div>
);
}