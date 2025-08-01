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
  const [academic_details, setAcademicDetails] = React.useState<{
    academic_session: string;
    semester: string;
    year: string;
  } | null>(null);

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

        const { results, academic_details } = await response.json();

        setResults(results);
        setAcademicDetails(academic_details);

        setItem("grade-distribution-data", results, 2 * 60 * 60 * 1000); //? Cache for 2 hour
        setItem("academic_details", academic_details, 2 * 60 * 60 * 1000); //? Cache for 2 hour
      } catch (error) {
        console.error("Error fetching results:", error);
        toast.error("Failed to fetch results");
      }
    };

    //? Check if cached data exists
    const cachedData = getItem("grade-distribution-data");
    const cachedAcademicDetails = getItem("academic_details");

    if (cachedData && cachedAcademicDetails) {
      setResults(cachedData);
      setAcademicDetails(cachedAcademicDetails);
    } else {
      fetchResults();
    }
  }, [getItem, setItem]);
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <GradeDistributionChart
        data={results}
        academicDetails={academic_details}
      />
    </div>
  );
};

export default Dashboard;
