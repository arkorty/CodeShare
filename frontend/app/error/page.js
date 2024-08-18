"use client";

import { useRouter } from "next/navigation";
import { Button } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-indigo-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="w-12 h-12 flex bg-gray-800 items-center justify-center rounded-xl shadow-custom-dark cursor-pointer"
            onClick={() => router.push("/")}
          >
            <CodeIcon fontSize="large" />
          </div>
          <h1 className="text-lg ml-2">CodeShare</h1>
        </div>
      </header>

      <div className="flex items-center justify-center flex-1 bg-zinc-800 p-4">
        <div className="text-center bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <h1 className="text-9xl font-extrabold text-white tracking-widest mb-4">
            404
          </h1>
          <div className="bg-amber-600 px-2 text-sm rounded rotate-12 absolute">
            Page Not Found
          </div>
          <div className="text-white mt-8 mb-6">
            <h3 className="text-2xl font-bold mb-2">
              Oops! The page you're looking for doesn't exist.
            </h3>
            <p className="text-md">
              An error must have occured while creating your code snippet.
            </p>
          </div>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => router.push("/")}
            className="mt-6 bg--purple-400 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Go Back Home
          </Button>
        </div>
      </div>
    </div>
  );
}
