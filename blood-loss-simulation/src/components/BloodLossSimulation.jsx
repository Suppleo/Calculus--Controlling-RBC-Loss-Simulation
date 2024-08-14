import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "../components/ui/button";

const BloodLossSimulation = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [data, setData] = useState([]);
  const [showGif, setShowGif] = useState(false);

  const calculateRBC = (t, isANH) => {
    const initialRBC = 0.45 * 5; // 45% of 5L
    if (isANH) {
      const V = 0.86; // Amount extracted in ANH procedure
      return ((9 / 20) * (5 - V) * Math.exp(-t / 10)).toFixed(3);
    } else {
      return (initialRBC * Math.exp(-t / 10)).toFixed(3);
    }
  };

  useEffect(() => {
    if (isRunning && time < 4) {
      const timer = setTimeout(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 0.1;
          if (newTime <= 4.05) {
            setData((prevData) => [
              ...prevData,
              {
                time: newTime.toFixed(1),
                withoutANH: calculateRBC(newTime, false),
                withANH: calculateRBC(newTime, true),
              },
            ]);
          }
          return newTime;
        });
      }, 100);
      return () => clearTimeout(timer);
    } else if (time >= 4) {
      setIsRunning(false);
    }
  }, [isRunning, time]);

  const handleStart = () => {
    setTime(0);
    setData([
      {
        time: "0.0",
        withoutANH: calculateRBC(0, false),
        withANH: calculateRBC(0, true),
      },
    ]);
    setIsRunning(true);
  };

  useEffect(() => {
    document.body.style.display = "block";
    document.body.style.backgroundColor = "#f0f4f8";
    return () => {
      document.body.style.display = "";
      document.body.style.backgroundColor = "";
    };
  }, []);

  const toggleGif = () => {
    setShowGif(!showGif);
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Blood Loss Simulation
      </h2>
      <div className="flex space-x-4 mb-4">
        <Button onClick={handleStart} disabled={isRunning}>
          {isRunning ? "Simulating..." : "Start Simulation"}
        </Button>
        <Button onClick={toggleGif}>{showGif ? "Hide GIF" : "Show GIF"}</Button>
      </div>
      <div className="mt-4 w-full" style={{ height: "70vh" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
              label={{ value: "Time (hours)", position: "bottom" }}
            />
            <YAxis
              label={{
                value: "RBC Volume (L)",
                angle: -90,
                position: "insideLeft",
                tickCount: 7,
              }}
            />
            <Tooltip />
            <Legend verticalAlign="top" align="center" height={36} />
            <Line
              type="monotone"
              dataKey="withoutANH"
              stroke="#8884d8"
              name="Without ANH"
            />
            <Line
              type="monotone"
              dataKey="withANH"
              stroke="#82ca9d"
              name="With ANH"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {showGif && (
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="Calculus--Controlling-RBC-Loss-Simulation/blood_loss_simulation.gif"
            alt="Blood Loss Simulation GIF"
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

export default BloodLossSimulation;
