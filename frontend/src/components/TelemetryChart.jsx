import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function TelemetryChart({ data, deviceId }) {
  return (
    <div className="bg-white shadow p-4 rounded">
      <h2 className="text-lg font-semibold mb-2">Device {deviceId} Telemetry</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="timestamp" hide />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#f87171" />
          <Line type="monotone" dataKey="vibration" stroke="#60a5fa" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
