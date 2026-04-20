"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginSuccess() {

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

console.log("ACCESS TOKEN:", accessToken);
console.log("REFRESH TOKEN:", refreshToken);

if (accessToken && refreshToken) {

  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  setTimeout(() => {
    router.replace("/home")
  }, 100);
  
    } else {
      router.replace("/login");
    }

  }, [searchParams, router]);  // 🔥 IMPORTANT FIX

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-xl font-semibold text-green-700 animate-pulse">
      Logging in...
      </p>
    </div>
  );
}