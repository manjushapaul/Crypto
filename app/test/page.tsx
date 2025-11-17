"use client";

export default function TestPage() {
  return (
    <div style={{ padding: "50px", textAlign: "center" }}>
      <h1>Test Page</h1>
      <p>If you can see this, the server is running!</p>
      <div style={{ marginTop: "20px" }}>
        <a href="/" style={{ marginRight: "20px" }}>Go to Home</a>
        <a href="/settings">Go to Settings</a>
      </div>
    </div>
  );
}

