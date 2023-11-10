import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const DataChart = ({ salesData }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart
                width={500}
                height={300}
                data={salesData}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {/* Assuming you want a bar for each month */}
                <Bar dataKey="sales[0]" fill="#8884d8" name="6 months ago" />
                <Bar dataKey="sales[1]" fill="#82ca9d" name="5 months ago" />
                <Bar dataKey="sales[2]" fill="#ffc658" name="4 months ago" />
                <Bar dataKey="sales[3]" fill="#ff8042" name="3 months ago" />
                <Bar dataKey="sales[4]" fill="#41ead4" name="2 months ago" />
                <Bar dataKey="sales[5]" fill="#f66767" name="Last month" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DataChart;
