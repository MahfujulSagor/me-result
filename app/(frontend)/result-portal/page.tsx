"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import ME from "@/public/me-logo.png";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Controller, useForm } from "react-hook-form";
import { resultFormSchema } from "@/lib/resultFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAppwrite } from "@/context/appwrite-context";
import { Badge } from "@/components/ui/badge";
import { NavUser } from "@/components/nav-user";
import { Backlog, StudentResult } from "@/types/resultType";
import { LoaderIcon } from "lucide-react";

type ResultFormValues = z.infer<typeof resultFormSchema>;

const ResultPortal: React.FC = () => {
  const [backlogs, setBacklogs] = React.useState<Backlog[]>([]);
  const [result, setResult] = React.useState<StudentResult | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { academic_session, student_id } = useAppwrite();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResultFormValues>({
    resolver: zodResolver(resultFormSchema),
  });

  const onSubmit = async (data: ResultFormValues): Promise<void> => {
    setLoading(true);

    try {
      const response = await fetch(`/api/v1/get-result`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year: data.year,
          semester: data.semester,
          academic_session: academic_session,
          student_id: student_id,
        }),
      });

      if (!response.ok) {
        console.error("Failed to fetch result:", response.statusText);
        return;
      }

      const result = await response.json();

      setResult(result);

      if (result.has_backlogs) {
        const parsed = JSON.parse(result.backlogs);
        setBacklogs(parsed);
      }

      toast.success("Result fetched successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      return;
    } finally {
      reset();
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center w-full relative lg:pt-0 pt-30">
      {/* Navbar */}
      <nav className="py-4 px-2 flex items-center justify-between bg-background fixed top-0 left-0 right-0">
        <div className="flex items-center gap-2">
          <div>
            <Image src={ME} width={50} priority={true} alt="ME-Logo" />
          </div>
          <h1 className="font-semibold text-2xl hidden md:flex tracking-tight">
            Mechanical Engineering
          </h1>
        </div>

        <NavUser
          user={{ student_id: student_id, academic_session: academic_session }}
        />
      </nav>

      {/* Result Portal Content */}
      {result ? (
        <div className="w-full flex items-center justify-center">
          <Card className="w-full max-w-5xl shadow-2xl shadow-blue-200">
            <CardHeader>
              <CardTitle className="text-center lg:text-3xl text-2xl font-semibold mt-2">
                Semester Final Result
              </CardTitle>
            </CardHeader>
            <div>
              <CardContent className="flex items-center justify-center">
                <div className="w-4xl grid lg:grid-cols-2 grid-cols-1 gap-2">
                  {/* Info Card */}
                  <Card className="Info-card bg-blue-200/70 border border-blue-200 shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-xl">Student Profile</CardTitle>
                      <CardDescription>Personal Information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-1 sm:text-lg">
                        <p>
                          <strong>Name:</strong> {result.name}
                        </p>
                        <p>
                          <strong>Student ID:</strong> {result.student_id}
                        </p>
                        <p>
                          <strong>Year:</strong> {result.year}
                        </p>
                        <p>
                          <strong>Semester:</strong> {result.semester}
                        </p>
                        <p>
                          <strong>Session:</strong> {result.academic_session}
                        </p>
                        <p>
                          <strong>Total Credit:</strong> {result.total_credit}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CG Card */}
                  <Card className="w-full bg-cyan-200/50 border-cyan-200 shadow-lg border rounded-xl">
                    <CardHeader>
                      <CardTitle className="text-xl">
                        Academic Summary
                      </CardTitle>
                      <CardDescription>Overall Performance</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 sm:text-lg">
                      <div className="flex items-center justify-between">
                        <p>
                          <strong>CGPA:</strong>
                        </p>
                        <Badge className="text-md px-3 py-1 bg-teal-200 text-balck border border-teal-400">
                          {result.cgpa}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>
                          <strong>Total Credits:</strong>
                        </p>
                        <Badge className="text-md px-3 py-1 bg-blue-100 text-blue-800 border border-blue-300">
                          {result.total_credit}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <p>
                          <strong>Grade:</strong>
                        </p>
                        <Badge className="text-md px-3 py-1 bg-yellow-100 text-yellow-800 border border-yellow-300">
                          {result.grade}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Backlogs Card */}
                  {result?.has_backlogs && (
                    <Card className="w-full lg:col-span-2 col-span-1 bg-rose-200/50 border-rose-200 shadow-lg border rounded-xl">
                      <CardHeader>
                        <CardTitle className="text-xl">Backlogs</CardTitle>
                        <CardDescription>Failed Courses</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {backlogs.map((item, index) => (
                          <div
                            key={index}
                            className="p-3 border border-rose-300 rounded-md bg-rose-200 sm:text-lg"
                          >
                            <p>
                              <strong>Course:</strong> {item.course}
                            </p>
                            <p>
                              <strong>Credit Lost:</strong> {item.credit_lost}
                            </p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center items-center mt-10">
                <Button
                  variant="destructive"
                  onClick={() => {
                    setResult(null);
                    setBacklogs([]);
                  }}
                >
                  Back to Portal
                </Button>
              </CardFooter>
            </div>
          </Card>
        </div>
      ) : (
        <div className="w-full flex items-center justify-center">
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
              <CardTitle className="text-center mt-2">Result Portal</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="mb-6">
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="year">Year</Label>
                    <Controller
                      name="year"
                      defaultValue=""
                      control={control}
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
    </div>
  );
};

export default ResultPortal;
