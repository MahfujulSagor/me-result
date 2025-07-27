"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Controller, useForm } from "react-hook-form";
import { uploadSchema } from "@/lib/resultUploadSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import { sessions } from "@/lib/sessions";
import Image from "next/image";
import ME from "@/public/me-logo.png";
import { LoaderIcon } from "lucide-react";

type uploadFormValues = z.infer<typeof uploadSchema>;

const UploadResult: React.FC = () => {
  const [formKey, setFormKey] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<uploadFormValues>({ resolver: zodResolver(uploadSchema) });

  const onSubmit = async (data: uploadFormValues): Promise<void> => {
    setLoading(true);

    const formData = new FormData();
    formData.append("semester", data.semester);
    formData.append("year", data.year);
    formData.append("Session", data.session);
    formData.append("file", data.result);

    try {
      const res = await fetch("/api/v1/publish-result", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        console.error("Failed to publish results");
      }
    } catch (error) {
      console.error("Error publishing results:", error);
      toast.error("Failed to publish results. Please try again.");
      return;
    } finally {
      setLoading(false);
      reset();
      toast.success("Results published successfully!");
      setFormKey((prev) => prev + 1); //? Force re-render to reset the form
    }
  };
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-sm shadow-2xl shadow-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Image src={ME} alt="ME_logo" width={65} className="object-cover" />
          </CardTitle>
          <CardTitle className="text-center mt-2">Publish Results</CardTitle>
        </CardHeader>
        <form key={formKey} onSubmit={handleSubmit(onSubmit)}>
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
              <div className="grid gap-2">
                <Label htmlFor="session">Session</Label>
                <Controller
                  name="session"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Session" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Session</SelectLabel>
                          {sessions.map((session) => (
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
                {errors.session && (
                  <p className="text-red-500">{errors.session.message}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="result">
                  Result{" "}
                  <span className="text-blue-400">(e.g, example.xlsx)</span>
                </Label>
                <Controller
                  name="result"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="result"
                      type="file"
                      accept=".xlsx"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        field.onChange(file);
                      }}
                    />
                  )}
                />
                {errors.result && (
                  <p className="text-red-500">{errors.result.message}</p>
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
                "Publish Results"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default UploadResult;
