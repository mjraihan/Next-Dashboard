"use client";

import "@/styles/loader.css";

export default function PageLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-base-100 flex items-center justify-center z-[99999]">
      <div className="text-center">
        <div className="text-sm mb-3">Page Loading ...</div>
        <div className="custom-loader"></div>
      </div>
    </div>
  );
}
