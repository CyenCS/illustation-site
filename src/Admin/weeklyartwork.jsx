import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import CustomTooltip from './customtooltip';

const data = [
  { day: "9 Oct", users: 7 },
  { day: "10 Oct", users: 0 },
  { day: "11 Oct", users: 0 },
  { day: "12 Oct", users: 8 },
  { day: "13 Oct", users: 3 },
  { day: "14 Oct", users: 9 },
  { day: "15 Oct", users: 4 }
];

const ArtworkLineChart = () => {
  return (
    <div className="chart-container">
        <h2>Artworks Activity</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
      <Line
        dataKey="users"
        stroke="#F44236"
        strokeWidth={3}
      />
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" stroke="#fff" fontSize={14}/>
      <YAxis stroke="#fff" fontSize={14}/>
      <Tooltip content={<CustomTooltip />} />
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
};

export default ArtworkLineChart;