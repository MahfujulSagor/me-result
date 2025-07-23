"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { studentSchema } from "@/lib/studentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type studentLoginSchema = z.infer<typeof studentSchema>;

const Login: React.FC = () => {
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<studentLoginSchema>({ resolver: zodResolver(studentSchema) });

  const onSubmit = async (data: studentLoginSchema): Promise<void> => {
    const formData = new FormData();

    formData.append("studentID", data.studentID);
    formData.append("email", data.email);
    formData.append("studentID", data.password);

    try {
    } catch (error) {
      console.error("Error during login:", error);
      toast.error(
        "Failed to login. Please check your credentials and try again."
      );
    } finally {
      reset();
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="studentID">Student ID</Label>
                  <Input
                    id="studentID"
                    type="text"
                    placeholder="Student ID"
                    {...register("studentID")}
                    required
                  />
                  {errors.studentID && (
                    <p className="text-red-500">{errors.studentID.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="me@example.com"
                    {...register("email")}
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    {...register("password")}
                    required
                  />
                  {errors.password && (
                    <p className="text-red-500">{errors.password.message}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-6">
            <Button type="submit" className="w-full">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
