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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import ME from "@/public/me-logo.png";
import { userSchema } from "@/lib/userSchema";
import { useAppwrite } from "@/context/appwrite-context";
import { Eye, EyeOff, LoaderIcon } from "lucide-react";

type signUpSchema = z.infer<typeof userSchema>;

const SignUp: React.FC = () => {
  const { signUp } = useAppwrite();
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const {
    handleSubmit,
    formState: { errors },
    register,
    reset,
  } = useForm<signUpSchema>({ resolver: zodResolver(userSchema) });

  const onSubmit = async (data: signUpSchema): Promise<void> => {
    setLoading(true);

    try {
      await signUp({
        email: data.email.trim().toLocaleLowerCase(),
        username: data.username.trim().toLocaleUpperCase(),
        password: data.password,
      });
    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error(
        "Failed to sign up. Please check your credentials and try again."
      );
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <Card className="w-full max-w-sm shadow-2xl shadow-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Image src={ME} alt="ME_logo" width={65} className="object-cover" />
          </CardTitle>
          <CardTitle className="text-center mt-2">
            Create a new account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials below to create a new account
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="lowercase"
                    placeholder="email"
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
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      className="pr-10"
                      {...register("password")}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
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
              {loading ? (
                <LoaderIcon className="animate-spin h-6 w-6" />
              ) : (
                "Sign Up"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
