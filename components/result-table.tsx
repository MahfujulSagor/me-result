"use client";

import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, Plus, Trash2 } from "lucide-react";
import { Backlog, StudentResult } from "@/types/resultType";
import { useExpiryStorage } from "@/hooks/useExpiryStorage";

export interface ResultTableRef {
  getFinalData: () => StudentResult[];
}

interface Props {
  results: StudentResult[] | null;
  editable?: boolean;
}

//? Restrict editable student fields
type EditableStudentField = keyof Pick<
  StudentResult,
  "student_id" | "name" | "total_credit" | "cgpa" | "grade"
>;

const ResultTable = forwardRef<ResultTableRef, Props>(
  ({ results, editable = false }, ref) => {
    const [data, setData] = useState<StudentResult[] | null>(results);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const { setItem } = useExpiryStorage();

    useImperativeHandle(ref, () => ({
      getFinalData: () => data || [],
    }));

    const persist = (data: StudentResult[]) => {
      setItem("extractedResults", data, 60); //? expire in 60 minutes
    };

    const handleFieldChange = (
      rowIndex: number,
      field: EditableStudentField,
      value: string
    ) => {
      if (!data) return;
      const updated = [...data];
      updated[rowIndex] = {
        ...updated[rowIndex],
        [field]: value,
      };
      setData(updated);
      persist(updated);
    };

    const handleBacklogChange = (
      rowIndex: number,
      backlogIndex: number,
      field: keyof Backlog,
      value: string
    ) => {
      if (!data) return;
      const updated = [...data];
      let backlogs: Backlog[] = [];
      try {
        backlogs = updated[rowIndex].has_backlogs
          ? JSON.parse(updated[rowIndex].backlogs)
          : [];
      } catch {}
      const updatedBacklogs = [...backlogs];
      updatedBacklogs[backlogIndex] = {
        ...updatedBacklogs[backlogIndex],
        [field]: value,
      };
      updated[rowIndex].backlogs = JSON.stringify(updatedBacklogs);
      setData(updated);
      persist(updated);
    };

    const addBacklog = (rowIndex: number) => {
      if (!data) return;
      const updated = [...data];
      let backlogs: Backlog[] = [];
      try {
        backlogs = updated[rowIndex].has_backlogs
          ? JSON.parse(updated[rowIndex].backlogs)
          : [];
      } catch {}
      backlogs.push({ course: "", credit_lost: "" });
      updated[rowIndex].backlogs = JSON.stringify(backlogs);
      updated[rowIndex].has_backlogs = true;
      setData(updated);
      persist(updated);
    };

    const removeBacklog = (rowIndex: number, backlogIndex: number) => {
      if (!data) return;
      const updated = [...data];
      let backlogs: Backlog[] = [];
      try {
        backlogs = updated[rowIndex].has_backlogs
          ? JSON.parse(updated[rowIndex].backlogs)
          : [];
      } catch {}
      backlogs.splice(backlogIndex, 1);
      updated[rowIndex].backlogs = JSON.stringify(backlogs);
      updated[rowIndex].has_backlogs = backlogs.length > 0;
      setData(updated);
      persist(updated);
    };

    const toggleEdit = (index: number) => {
      setEditingIndex(editingIndex === index ? null : index);
    };

    return (
      <div className="max-h-[75vh] max-w-5xl overflow-y-auto w-full">
        <Table className="table-auto w-full">
          <TableCaption>
            {data?.[0]?.academic_session} Session {data?.[0]?.year} Year{" "}
            {data?.[0]?.semester} Semester Final Results
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="whitespace-nowrap">
                Credits Earned
              </TableHead>
              <TableHead>Backlogs</TableHead>
              <TableHead className="whitespace-nowrap">CGPA</TableHead>
              <TableHead className="whitespace-nowrap">Grade</TableHead>
              {editable && <TableHead className="text-center">Edit</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((student, i) => {
              const isEditing = editingIndex === i;
              let backlogs: Backlog[] = [];
              try {
                backlogs = student.has_backlogs
                  ? JSON.parse(student.backlogs)
                  : [];
              } catch (e) {
                console.error("Invalid backlog JSON", e);
              }

              return (
                <TableRow key={i} className={isEditing ? "bg-muted/80" : ""}>
                  <TableCell className="">
                    {isEditing ? (
                      <Input
                        value={student.student_id}
                        onChange={(e) =>
                          handleFieldChange(i, "student_id", e.target.value)
                        }
                        type="text"
                        className=""
                      />
                    ) : (
                      student.student_id
                    )}
                  </TableCell>
                  <TableCell className="">
                    {isEditing ? (
                      <Input
                        value={student.name}
                        onChange={(e) =>
                          handleFieldChange(i, "name", e.target.value)
                        }
                        type="text"
                        className=""
                      />
                    ) : (
                      student.name
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        value={student.total_credit}
                        onChange={(e) =>
                          handleFieldChange(i, "total_credit", e.target.value)
                        }
                        type="text"
                        className=""
                      />
                    ) : (
                      student.total_credit
                    )}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <div className="flex flex-col gap-1">
                        {backlogs.map((b, j) => (
                          <div
                            key={j}
                            className="grid grid-cols-1 gap-1 items-center"
                          >
                            <Input
                              value={b.course}
                              placeholder="Course"
                              className="col-span-2"
                              onChange={(e) =>
                                handleBacklogChange(
                                  i,
                                  j,
                                  "course",
                                  e.target.value
                                )
                              }
                              type="text"
                            />
                            <Input
                              value={b.credit_lost}
                              placeholder="Credit"
                              className=""
                              onChange={(e) =>
                                handleBacklogChange(
                                  i,
                                  j,
                                  "credit_lost",
                                  e.target.value
                                )
                              }
                              type="text"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="cursor-pointer border hover:border-red-500"
                              onClick={() => removeBacklog(i, j)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => addBacklog(i)}
                          className="mt-1 w-fit cursor-pointer"
                        >
                          <Plus className="w-4 h-4 mr-1" /> Add Backlog
                        </Button>
                      </div>
                    ) : (
                      <div className="">
                        {backlogs.map((b, j) => (
                          <div key={j}>
                            {b.course} ({b.credit_lost})
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        value={student.cgpa}
                        onChange={(e) =>
                          handleFieldChange(i, "cgpa", e.target.value)
                        }
                        type="text"
                      />
                    ) : (
                      student.cgpa
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {isEditing ? (
                      <Input
                        value={student.grade}
                        onChange={(e) =>
                          handleFieldChange(i, "grade", e.target.value)
                        }
                        type="text"
                      />
                    ) : (
                      student.grade
                    )}
                  </TableCell>
                  {editable && (
                    <TableCell className="text-center">
                      <Button
                        type="button"
                        variant="ghost"
                        className="cursor-pointer"
                        size="icon"
                        onClick={() => toggleEdit(i)}
                      >
                        {isEditing ? (
                          <Check className="w-4 h-4 text-teal-600" />
                        ) : (
                          <Pencil className="w-4 h-4 text-blue-600" />
                        )}
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
);

ResultTable.displayName = "ResultTable";

export default ResultTable;
