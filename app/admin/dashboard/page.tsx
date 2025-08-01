"use client";
import { GradeDistributionChart } from "@/components/grade-distribution-chart";
import { useExpiryStorage } from "@/hooks/useExpiryStorage";
import React from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const { getItem, setItem } = useExpiryStorage();

  const [results, setResults] = React.useState<
    { grade: string; count: number }[]
  >([]);

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/v1/admin/results/latest", {
          method: "GET",
        });

        if (!response.ok) {
          console.error("Failed to fetch results");
          toast.error("Failed to fetch results");
        }

        const { results } = await response.json();

        setResults(results);
        setItem("grade-distribution-data", results, 2 * 60 * 60 * 1000); //? Cache for 2 hour
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to fetch results");
      }
    };

    //? Check if cached data exists
    const cachedData = getItem("grade-distribution-data");

    if (cachedData) {
      setResults(cachedData);
    } else {
      fetchResults();
    }
  }, [getItem, setItem]);
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <GradeDistributionChart data={results} />
    </div>
  );
};

export default Dashboard;
