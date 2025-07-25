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
import { useAppwrite } from "@/context/appwrite-context";

const ResultPortal = () => {
  const { logout, session, academic_session } = useAppwrite();
  console.log("Session Data:", session);

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
            <h1 className="font-medium">{session?.userId}</h1>
            <p className="font-medium">{academic_session}</p>
            <Button
              onClick={logout}
              className="bg-blue-500 hover:bg-blue-600 mt-2"
            >
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
          <form>
            <CardContent className="mb-6">
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="year">Year</Label>
                  <Select>
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
                  {/* {errors.year && (
                    <p className="text-red-500">{errors.year.message}</p>
                  )} */}
                </div>
                <div className="grid gap-2 w-full">
                  <Label htmlFor="semester">Semester</Label>
                  <Select>
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
                  {/* {errors.semester && (
                    <p className="text-red-500">{errors.semester.message}</p>
                  )} */}
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
