"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React from "react";
import ME from "@/public/me-logo.png";
import {
  Card,
  CardContent,
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

type ResultFormValues = z.infer<typeof resultFormSchema>;

const ResultPortal = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResultFormValues>({
    resolver: zodResolver(resultFormSchema),
  });

  const onSubmit = async (data: ResultFormValues): Promise<void> => {
    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("year", data.year);
    formData.append("session", "2023-2024"); // Assuming session is static for now
    formData.append("student_id", "ME24034"); // Assuming username is static for now

    const query = new URLSearchParams({
      year: data.year,
      semester: data.semester,
      session: "2023-2024",
      student_id: "ME24034",
    }).toString();

    try {
      const response = await fetch(`/api/v1/get-result?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch result:");
        return;
      }

      const result = await response.json();
      console.log("Result fetched successfully:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
      return;
    } finally {
      toast.success("Result fetched successfully!");
      reset(); // Reset form after submission
    }
  };

  return (
    <div className="">
      <nav className="py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <Image src={ME} width={60} alt="ME-Logo" />
          </div>
          <h1 className="font-semibold text-2xl tracking-tight">
            MECHANICAL ENGINEERING
          </h1>
        </div>

        <div className="flex items-center gap-4 tracking-tight">
          <div className="text-end">
            <p className="font-medium">Student ID: ME-24034</p>
            <p className="font-medium">Session: 2023-2024</p>
            <Button className="bg-blue-500 hover:bg-blue-600 mt-2">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="w-full flex items-center justify-center translate-y-1/2">
        <Card className="w-full max-w-sm shadow-2xl shadow-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Image
                src={ME}
                alt="ME_logo"
                width={65}
                className="object-cover"
                objectFit="cover"
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
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
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
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
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
                Get Result
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default ResultPortal;
