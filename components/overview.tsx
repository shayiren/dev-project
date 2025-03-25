"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 1200000,
  },
  {
    name: "Feb",
    total: 1900000,
  },
  {
    name: "Mar",
    total: 2300000,
  },
  {
    name: "Apr",
    total: 1800000,
  },
  {
    name: "May",
    total: 2100000,
  },
  {
    name: "Jun",
    total: 2800000,
  },
  {
    name: "Jul",
    total: 2500000,
  },
  {
    name: "Aug",
    total: 3200000,
  },
  {
    name: "Sep",
    total: 2900000,
  },
  {
    name: "Oct",
    total: 2400000,
  },
  {
    name: "Nov",
    total: 2700000,
  },
  {
    name: "Dec",
    total: 3500000,
  },
]

export function Overview() {
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border rounded-md shadow-sm">
          <p className="font-medium">{label}</p>
          <p className="text-primary">${payload[0].value.toLocaleString()}</p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

