import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Rectangle,
  ResponsiveContainer,
} from "recharts";
import React from "react";
import CustomTooltip from './customtooltip';

const data = [
  { day: "9 Oct", users: 2 },
  { day: "10 Oct", users: 5 },
  { day: "11 Oct", users: 1 },
  { day: "12 Oct", users: 4 },
  { day: "13 Oct", users: 3 },
  { day: "14 Oct", users: 0 },
  { day: "15 Oct", users: 6 }
];



const RegistryBarChart = () => {
return (
    <div className="chart-container">
        <h2>Weekly Registration Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
          <Bar
            dataKey="users"
            fill="#2196f3"
            activeBar={<Rectangle fill="gold" stroke="purple" />}
          />
          <CartesianGrid stroke="#94a3b8" strokeDasharray="3 3" />
          <XAxis dataKey="day" stroke="#fff" fontSize={14}/>
          <YAxis stroke="#fff" fontSize={14}/>
          <Tooltip content={<CustomTooltip />} />
          </BarChart>
        </ResponsiveContainer>
    </div>
  );
};

export default RegistryBarChart;