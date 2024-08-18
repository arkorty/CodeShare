"use client";
import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
        <h1 className="text-9xl font-extrabold text-white tracking-widest mb-4">
          404
        </h1>
        <div className="bg-[#FF6A3D] px-2 text-sm rounded rotate-12 absolute">
          Page Not Found
        </div>
        <div className="text-white mt-8 mb-6">
          <h3 className="text-2xl font-bold mb-2">
            Oops! The page you're looking for doesn't exist.
          </h3>
          <p className="text-lg">It might have been moved or deleted.</p>
        </div>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.push("/")}
          className="mt-6 bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Go Back Home
        </Button>
      </div>
    </div>
  );
}
