import React, { useEffect, useState } from "react";
import DeviceList from "./components/DeviceList";
import TelemetryChart from "./components/TelemetryChart";

export default function App() {
  const [devices, setDevices] = useState([]);
  const [telemetry, setTelemetry] = useState({}); // { deviceId: [records...] }
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000/ws");

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "telemetry") {
        const { deviceId } = msg.payload;
        setDevices((prev) =>
          prev.includes(deviceId) ? prev : [...prev, deviceId]
        );
        setTelemetry((prev) => ({
          ...prev,
          [deviceId]: [...(prev[deviceId] || []), msg.payload].slice(-20), // keep last 20
        }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Telemetry Viewer</h1>
      <DeviceList devices={devices} onSelect={setSelected} selected={selected} />
      {selected && (
        <TelemetryChart data={telemetry[selected] || []} deviceId={selected} />
      )}
    </div>
  );
}
