"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaMicrophone } from "react-icons/fa";


export default function Home() {

  const router = useRouter();
  const [token,setToken] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
 

  const [formData, setFormData] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });


  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ranges, setRanges] = useState(null);

  useEffect(() => {

  setTimeout(() => {

    const token = localStorage.getItem("accessToken");

    console.log("FINAL TOKEN:", token);

    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.replace("/login");
        return;
      }

      if (payload.role === "ADMIN") {
        setIsAdmin(true);
      }

    } catch (e) {
      localStorage.clear();
      router.replace("/login");
      return;
    }

    setMounted(true);

  }, 200); // 🔥 IMPORTANT DELAY

}, [router]);

  useEffect(() => {

    fetch("http://localhost:8082/api/input-range")
      .then(res => res.json())
      .then(data => {
        setRanges(data);
      });

  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/login");
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const startVoiceInput = () => {

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(() => {
        recognition.start();
      })
      .catch(() => {
        alert("Microphone permission required");
      });

    recognition.onresult = (event) => {

      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      transcript = transcript.toLowerCase();

      const aliases = {
        nitrogen: ["nitrogen", "n"],
        phosphorus: ["phosphorus", "p"],
        potassium: ["potassium", "k"],
        ph: ["ph", "ph level"],
        temperature: ["temperature", "temp"],
        humidity: ["humidity"],
        rainfall: ["rainfall", "rain"]
      };

      let updated = { ...formData };

      Object.keys(aliases).forEach(field => {

        aliases[field].forEach(alias => {

          const regex = new RegExp(alias + "\\s*(\\d+(\\.\\d+)?)");

          const match = transcript.match(regex);

          if (match) {
            updated[field] = match[1];
          }

        });

      });

      setFormData(updated);

    };

  };

  const speakResult = (crop, confidence) => {

    const speech = new SpeechSynthesisUtterance(
      `Recommended crop is ${crop}. Confidence ${confidence.toFixed(2)} percent`
    );

    speech.lang = "en-US";

    window.speechSynthesis.speak(speech);

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (Object.values(formData).some(v => v === "")) {
      alert("Fill all fields");
      return;
    }

    // 🔹 Frontend validation
    if (!ranges) {
      return;
    }
    if (formData.nitrogen < ranges.nitrogenMin || formData.nitrogen > ranges.nitrogenMax) {
      alert(`Nitrogen must be between ${ranges.nitrogenMin} and ${ranges.nitrogenMax}`);
      return;
    }

    if (formData.phosphorus < ranges.phosphorusMin || formData.phosphorus > ranges.phosphorusMax) {
      alert(`Phosphorus must be between ${ranges.phosphorusMin} and ${ranges.phosphorusMax}`);
      return;
    }

    if (formData.potassium < ranges.potassiumMin || formData.potassium > ranges.potassiumMax) {
      alert(`Potassium must be between ${ranges.potassiumMin} and ${ranges.potassiumMax}`);
      return;
    }

    if (formData.temperature < ranges.temperatureMin || formData.temperature > ranges.temperatureMax) {
      alert(`Temperature must be between ${ranges.temperatureMin} and ${ranges.temperatureMax}`);
      return;
    }

    if (formData.humidity < ranges.humidityMin || formData.humidity > ranges.humidityMax) {
      alert(`Humidity must be between ${ranges.humidityMin} and ${ranges.humidityMax}`);
      return;
    }

    if (formData.ph < ranges.phMin || formData.ph > ranges.phMax) {
      alert(`pH must be between ${ranges.phMin} and ${ranges.phMax}`);
      return;
    }

    if (formData.rainfall < ranges.rainfallMin || formData.rainfall > ranges.rainfallMax) {
      alert(`Rainfall must be between ${ranges.rainfallMin} and ${ranges.rainfallMax}`);
      return;
    }

    setLoading(true);
    setResult(null);

    try {

      const token = localStorage.getItem("accessToken");

      let res = await fetch("http://localhost:8082/api/predict", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },

        body: JSON.stringify({

          nitrogen: Number(formData.nitrogen),
          phosphorus: Number(formData.phosphorus),
          potassium: Number(formData.potassium),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          ph: Number(formData.ph),
          rainfall: Number(formData.rainfall)

        })

      });

      // access token expired → refresh
      if (res.status === 401) {

        const refreshToken = localStorage.getItem("refreshToken");

        const refreshRes = await fetch("http://localhost:8082/auth/refresh-token", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            refreshToken
          })

        });

        if (!refreshRes.ok) {
          localStorage.clear();
          router.replace("/login");
          return;
        }

        const refreshData = await refreshRes.json();

        if (!refreshData.accessToken) {
          localStorage.clear();
          router.replace("/login");
          return;
        }

        localStorage.setItem("accessToken", refreshData.accessToken);

        // retry original request
        res = await fetch("http://localhost:8082/api/predict", {

          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${refreshData.accessToken}`
          },

          body: JSON.stringify({

            nitrogen: Number(formData.nitrogen),
            phosphorus: Number(formData.phosphorus),
            potassium: Number(formData.potassium),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall)

          })

        });

      }

      if (!res.ok) {
        let message = "Server Error";
        try {
          const errData = await res.json();
          message = errData.error || errData.message || message;
        } catch (e) { }
        throw new Error(message);
      }

      const data = await res.json();

      setResult({
        crop: data.recommendedCrop,
        confidence: data.confidence
      });

      speakResult(data.recommendedCrop, data.confidence);

    } catch (err) {
      setResult({ error: err.message || "Server Error" });
    }

    setLoading(false);

  };

  if (!mounted) return null;

 const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

  const item = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120 }
  }
};

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">

    <div className="w-[950px] h-[600px] flex rounded-3xl overflow-hidden
    border border-cyan-500/30 shadow-[0_0_80px_rgba(0,255,255,0.3),0_0_120px_rgba(0,255,255,0.2)]">

      {/* LEFT IMAGE */}
      <div className="w-1/2 h-full">
        <div
          className="w-full h-full bg-cover bg-left flex items-center justify-center"
          style={{ backgroundImage: "url('/farmer.jpg')" }}
        >
          <div className="bg-black/40 p-4 rounded-xl text-center">
            <h1 className="text-3xl font-bold mb-2">🌾 WELCOME</h1>
            <p className="text-sm font-bold font-extralight ml-4">Smart Crop Recommendation</p>
          </div>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="w-1/2 h-full bg-slate-900 p-8 overflow-y-auto"
      >

        <div className="flex justify-end gap-3 mb-6 flex-wrap">


          <button  onClick={() => router.push("/home")} 
          className="bg-blue-500 px-4 py-2 rounded-lg text-sm
            shadow-lg transition-all duration-300 
            hover:scale-105 hover:bg-orange-700 cursor-pointer
            hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          >
             ⬅ Home
          </button>

          <button onClick={() => router.push("/history")} 
          className="bg-blue-500 px-4 py-2 rounded-lg text-sm
            shadow-lg transition-all duration-300
            hover:scale-105 hover:bg-orange-700 cursor-pointer
            hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
          >History
          </button>


          {isAdmin && (
            <button onClick={() => router.push("/admin")}
            className="bg-blue-500 px-4 py-2 rounded-lg text-sm
            shadow-lg transition-all duration-300
            hover:scale-105 hover:bg-orange-700 cursor-pointer
            hover:shadow-[0_0_15px_rgba(59,130,246,0.7)]"
            >Admin
            </button>
          )}

          {result && !result.error && (
          <button 
            onClick={() => router.push("/analytics")} 
            className="bg-blue-500 px-4 py-2 rounded-lg text-sm
            shadow-lg transition-all duration-300
            hover:scale-105 hover:bg-orange-700 cursor-pointer"
          >
            Analytics
          </button>
        )}

        </div>

        <motion.h2 variants={item} className="text-2xl font-bold text-cyan-400 mb-4 text-center">
          Crop Prediction🌾
        </motion.h2>

        <motion.button
          variants={item}
          onClick={startVoiceInput}
        className="w-full flex items-center justify-center gap-3 
          bg-gradient-to-r from-cyan-800 to-blue-700 py-3 rounded-xl 
          shadow-[0_0_20px_rgba(0,255,255,0.5)] 
          transition-all duration-300 cursor-pointer
          hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.9)] mb-4"
        >
          <FaMicrophone /> Voice Input
        </motion.button>

            <form onSubmit={handleSubmit} className="space-y-5">

              <motion.div variants={item}>

                <Section title="🌾 Soil Nutrients">
                  <AnimatedInput name="nitrogen" placeholder="Nitrogen (N)" value={formData.nitrogen} onChange={handleChange} />
                  <AnimatedInput name="phosphorus" placeholder="Phosphorus (P)" value={formData.phosphorus} onChange={handleChange} />
                  <AnimatedInput name="potassium" placeholder="Potassium (K)" value={formData.potassium} onChange={handleChange} />
                  <AnimatedInput name="ph" placeholder="pH Level" value={formData.ph} onChange={handleChange} />
                </Section>
              </motion.div>

              <motion.div variants={item}>

                <Section title="🌦 Climate Conditions">
                  <AnimatedInput name="temperature" placeholder="Temperature" value={formData.temperature} onChange={handleChange} />
                  <AnimatedInput name="humidity" placeholder="Humidity" value={formData.humidity} onChange={handleChange} />
                  <AnimatedInput name="rainfall" placeholder="Rainfall" value={formData.rainfall} onChange={handleChange} />
                </Section>
              </motion.div>

              <motion.button
                variants={item}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                disabled={!ranges || loading}
                className="w-full bg-emerald-500 py-3 rounded-xl text-white font-semibold
                transition-all duration-300
                hover:scale-105 hover:bg-green-600 cursor-pointer
                hover:shadow-[0_0_20px_rgba(34,197,94,0.8)]"

              >

                {loading ? "Predicting..." : "Predict Crop"}
              </motion.button>

            </form>

            {loading && (
              <p className="text-center mt-2 text-cyan-400">
                Processing...
              </p>
            )}

            {result && !result.error && (

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-5 rounded-xl 
                            bg-gradient-to-br from-green-900/40 to-green-800/30 
                            border border-green-400 
                            transition-all duration-300
                            hover:shadow-[0_0_30px_rgba(0,255,100,0.6)] text-sm space-y-1"

              >

                <p>🌾 Recommended Crop: {result.crop}</p>
                <p>📊 Confidence: {result.confidence?.toFixed(2)}%</p>

              </motion.div>

            )}

            {result?.error && (
              <div className="mt-6 p-4 bg-gradient-to-br from-red-900/40 to-red-800/30 
                              border border-red-400 
                              shadow-[0_0_20px_rgba(255,0,0,0.3)]">
                ❌ {result.error}
                
              </div>
            )}

            </motion.div>
             
         </div>
         
 </div>
 
  );
}

function Section({ title, children }) {

  return (

    <div>
      <h2 className="text-cyan-400 font-semibold mt-4 mb-3">{title}</h2>
      <div className="grid grid-cols-2 gap-5">
        {children}
      </div>
    </div>
  );

}

function AnimatedInput({ name, placeholder, value, onChange }) {

  return (

    <motion.input
      whileFocus={{ scale: 1.05 }}
      type="number"
      step="any"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full p-3 rounded-lg bg-slate-800 
        border border-cyan-400/40 
        outline-none transition-all duration-300
        focus:ring-2 focus:ring-cyan-400
        hover:border-cyan-300 hover:shadow-[0_0_10px_rgba(0,255,255,0.4)]"
    />

  );

}
