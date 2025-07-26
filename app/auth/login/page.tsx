"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userLoginSchema } from "@/lib/userLoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ME from "@/public/me-logo.png";
import { useAppwrite } from "@/context/appwrite-context";

type loginSchema = z.infer<typeof userLoginSchema>;

const Login: React.FC = () => {
  const { login } = useAppwrite();
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<loginSchema>({ resolver: zodResolver(userLoginSchema) });

  const onSubmit = async (data: loginSchema): Promise<void> => {
    try {
      await login(data.username.toUpperCase(), data.password);
      toast.success("Login successful!");
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
      <Card className="w-full max-w-sm shadow-2xl shadow-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Image
              src={ME}
              alt="ME_logo"
              width={65}
              className="object-cover"
            />
          </CardTitle>
          <CardTitle className="text-center mt-2">
            Login to your account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials below to login to your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <div>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="ID">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    className="uppercase"
                    placeholder="id"
                    {...register("username")}
                    required
                  />
                  {errors.username && (
                    <p className="text-red-500">{errors.username.message}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
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
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600"
            >
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
