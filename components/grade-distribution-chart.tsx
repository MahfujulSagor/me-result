"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type GradeData = {
  grade: string;
  count: number;
};

interface Props {
  data: GradeData[];
}

export function GradeDistributionChart({ data }: Props) {
  return (
    <Card className="w-full max-w-4xl mx-auto shadow-xl border border-muted p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Grade Distribution
        </CardTitle>
      </CardHeader>
      <CardContent className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="grade" className="text-muted-foreground text-sm" />
            <YAxis
              allowDecimals={false}
              className="text-muted-foreground text-sm"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
              }}
              cursor={{ fill: "#f3f4f6" }}
            />
            <Legend />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
