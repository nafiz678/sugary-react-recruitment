import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from '../provider/AuthProvider';

// Define form schema with zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

interface FormValues {
  email: string;
  password: string
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const context = useContext(AuthContext)
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const saveTokens = (accessToken: string, refreshToken: string, accessExpiry: string, refreshExpiry: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('accessExpiry', accessExpiry);
    localStorage.setItem('refreshExpiry', refreshExpiry);
  };

  // Form submission handler
  const onSubmit = async (values: FormValues) => {
    context?.setLoading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/AdminAccount/Login`, {
        UserName: values.email,
        Password: values.password
      })
      if (res.data) {
        toast.success("Login successful");
        saveTokens(res.data.Token, res.data.RefreshToken, res.data.AccessTokenExpiresAt, res.data.RefreshTokenExpiresAt);
        context?.setIsAuthenticated(true)
        context?.setUser(res.data.User)
        console.log(res.data)
        return navigate("/");
      }
    } catch (error) {
      console.log(error)
    } finally {
      context?.setLoading(false)
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="react@test.com"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="pr-10"
                  placeholder="••••••••"
                  {...form.register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={toggleShowPassword}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="w-full"
            >
              {context?.loading ? <Loader2 className="animate-spin" /> : "Login"}
            </Button>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">
                Sign up
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}