import { GradeDistributionChart } from "@/components/grade-distribution-chart";
import React from "react";

const dummyData = [
  { grade: "A+", count: 10 },
  { grade: "A", count: 18 },
  { grade: "A-", count: 12 },
  { grade: "B+", count: 7 },
  { grade: "B", count: 3 },
  { grade: "C", count: 1 },
];

const Dashboard = () => {
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <GradeDistributionChart data={dummyData} />
    </div>
  );
};

export default Dashboard;
