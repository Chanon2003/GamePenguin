// src/pages/NotFound.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-900 text-center px-4">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-xl text-zinc-700 dark:text-zinc-200 mb-6">
        Oops! หน้านี้ไม่พบ
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 text-white dark:bg-green-600 dark:text-yellow-300 px-6 py-3 rounded-lg shadow hover:bg-blue-600 dark:hover:bg-green-700 transition-colors"
      >
        กลับไปหน้าแรก
      </button>
    </div>
  );
};

export default NotFound;
