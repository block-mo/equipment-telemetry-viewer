import React from "react";

export default function DeviceList({ devices, onSelect, selected }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-semibold">Devices</h2>
      <ul className="flex gap-2">
        {devices.map((d) => (
          <li key={d}>
            <button
              onClick={() => onSelect(d)}
              className={`px-3 py-1 rounded ${
                selected === d ? "bg-blue-600 text-white" : "bg-blue-400"
              }`}
            >
              {d}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
