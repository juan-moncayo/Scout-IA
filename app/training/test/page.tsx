"use client";

import Script from "next/script";

export default function TestDidPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      {/* Script D-ID */}
      <Script
        type="module"
        src="https://agent.d-id.com/v2/index.js"
        data-mode="full"
        data-client-key="Z29vZ2xlLW9hdXRoMnwxMTA1MzY5OTUxODcxNzQwNzE3MTU6VVZEZlpzVlUyUHR1bERDbnNIUzd3"
        data-agent-id="v2_agt_KUGNpTIc"
        data-name="did-agent"
        data-monitor="true"
        data-target-id="avatar-here"
      />

      {/* Solo el contenedor del avatar */}
      <div 
        id="avatar-here" 
        className="w-full max-w-2xl h-[600px] bg-gray-900 rounded-lg"
      />
    </div>
  );
}