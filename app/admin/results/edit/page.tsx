"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import ME from "@/public/me-logo.png";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderIcon } from "lucide-react";
import z from "zod";
import { editResultSchema } from "@/lib/editResultSchema";
import { Input } from "@/components/ui/input";
import { academic_sessions } from "@/lib/academic-sessions";
import ResultTable, { ResultTableRef } from "@/components/result-table";
import { StudentResult } from "@/types/resultType";
import { toast } from "sonner";
import { useExpiryStorage } from "@/hooks/useExpiryStorage";

type formSchema = z.infer<typeof editResultSchema>;

const EditResults = () => {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<StudentResult[] | null>(null);

  const tableRef = React.useRef<ResultTableRef>(null);

  const { setItem, getItem } = useExpiryStorage();

  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm({
    resolver: zodResolver(editResultSchema),
  });

  //* Load saved results from localStorage on component mount
  React.useEffect(() => {
    const savedResults = getItem("editableStudentResults"); //? Returns parsed data or null
    if (savedResults && Array.isArray(savedResults)) {
      setResults(savedResults);
    }
  }, [getItem]);

  const onSubmit = async (data: formSchema) => {
    setLoading(true);
    setItem("editableStudentResults", null, 0); //? expire immediately

    try {
      const response = await fetch("/api/v1/admin/results/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_id: data.student_id.trim().toUpperCase(),
          semester: data.semester.trim(),
          year: data.year.trim(),
          academic_session: data.academic_session.trim(),
        }),
      });

      if (!response.ok) {
        console.error("Failed to edit result");
      }

      const resData: { results: StudentResult[] } = await response.json();
      const resultData = resData.results;
      setResults(resultData);
      setItem("editableStudentResults", resultData, 60); //? expire in 60 minutes
    } catch (error) {
      console.error("Error submitting edit result form:", error);
    } finally {
      reset();
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    const finalData = tableRef.current?.getFinalData();

    if (!finalData || finalData.length === 0) {
      toast.error("No data to publish");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/v1/admin/results/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ results: finalData }),
      });

      if (!res.ok) {
        toast.error("Failed to publish results");
        return;
      }

      localStorage.removeItem("editableStudentResults");

      toast.success("Result published successfully!");
    } catch (err) {
      console.error("Failed publish result:", err);
      toast.error("Something went wrong");
    } finally {
      setResults(null);
      setLoading(false);
    }
  };

  return (
    <>
      {results ? (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Card className="shadow-2xl shadow-blue-200 w-full max-w-5xl">
            <CardContent>
              <ResultTable ref={tableRef} results={results} editable={true} />
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Button
                onClick={() => {
                  setResults(null);
                  localStorage.removeItem("editableStudentResults");
                }}
                className="cursor-pointer"
                variant={"destructive"}
              >
                Cancel
              </Button>

              <Button
                onClick={handlePublish}
                className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
                variant={"default"}
              >
                {loading ? (
                  <LoaderIcon className="animate-spin h-6 w-6" />
                ) : (
                  "Publish Result"
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-sm shadow-2xl shadow-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <Image
                  src={ME}
                  alt="ME_logo"
                  width={65}
                  priority={true}
                  className="object-cover"
                />
              </CardTitle>
              <CardTitle className="text-center mt-2">Edit Result</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="mb-6">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="student_id">Student ID</Label>
                    <Input
                      id="student_id"
                      type="text"
                      className="uppercase"
                      placeholder="ID"
                      {...register("student_id")}
                      required
                    />
                    {errors.student_id && (
                      <p className="text-red-500">
                        {errors.student_id.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Controller
                      name="year"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Year</SelectLabel>
                              <SelectItem value="1">1st</SelectItem>
                              <SelectItem value="2">2nd</SelectItem>
                              <SelectItem value="3">3rd</SelectItem>
                              <SelectItem value="4">4th</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.year && (
                      <p className="text-red-500">{errors.year.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="semester">Semester</Label>
                    <Controller
                      name="semester"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Semester" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Semester</SelectLabel>
                              <SelectItem value="1">1st</SelectItem>
                              <SelectItem value="2">2nd</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.semester && (
                      <p className="text-red-500">{errors.semester.message}</p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="session">Session</Label>
                    <Controller
                      name="academic_session"
                      control={control}
                      defaultValue=""
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Session" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Session</SelectLabel>
                              {academic_sessions.map((session) => (
                                <SelectItem
                                  key={session.value}
                                  value={session.value}
                                >
                                  {session.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {errors.academic_session && (
                      <p className="text-red-500">
                        {errors.academic_session.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  {loading ? (
                    <LoaderIcon className="animate-spin h-6 w-6" />
                  ) : (
                    "Get Result"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}
    </>
  );
};

export default EditResults;
