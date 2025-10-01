"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface AnalyticsChartsProps {
  chartData: Array<{ month: string; revenue: number }>
  pieData: Array<{ name: string; value: number; color: string }>
}

export function AnalyticsCharts({ chartData, pieData }: AnalyticsChartsProps) {
  return (
    <div className="mb-8 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <div className="rounded-lg border bg-card p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-semibold">Revenue Trends</h3>
          <p className="text-sm text-muted-foreground">Monthly revenue for the last 30 days</p>
        </div>
        <ResponsiveContainer width="100%" height={250} className="text-xs md:text-sm">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border bg-card p-4 md:p-6">
        <div className="mb-4">
          <h3 className="text-base md:text-lg font-semibold">Booking Status Distribution</h3>
          <p className="text-sm text-muted-foreground">Breakdown of booking statuses</p>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={70}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              className="text-xs"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}