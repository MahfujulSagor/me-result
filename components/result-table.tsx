import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Backlog, StudentResult } from "@/types/resultType";

const ResultTable = ({ results }: { results: StudentResult[] | null }) => {
  return (
    <div className="max-h-[75vh] overflow-y-auto w-full">
      <Table>
        <TableCaption>
          {results?.[0]?.year} Year {results?.[0]?.semester} Semester Final
          Results
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Backlog</TableHead>
            <TableHead>Credit Lost</TableHead>
            <TableHead>CGPA</TableHead>
            <TableHead>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {results?.map((result, i) => {
            let backlogs: Backlog[] = [];
            if (result.has_backlogs && result.backlogs) {
              try {
                backlogs = JSON.parse(result.backlogs);
              } catch (error) {
                console.error(
                  `Failed to parse backlogs for ${result.student_id}`,
                  error
                );
                backlogs = [];
              }
            }
            const totalCreditLost = backlogs.reduce(
              (sum, b) => sum + Number(b.credit_lost || 0),
              0
            );
            return (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  {result.student_id}
                </TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>
                  {backlogs.length > 0
                    ? backlogs.map((b, index) => (
                        <div key={index}>
                          {b.course} ({b.credit_lost})
                        </div>
                      ))
                    : ""}
                </TableCell>
                <TableCell className="text-center">
                  {totalCreditLost > 0 ? totalCreditLost : ""}
                </TableCell>
                <TableCell className="text-center">{result.cgpa}</TableCell>
                <TableCell className="text-center">{result.grade}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResultTable;
