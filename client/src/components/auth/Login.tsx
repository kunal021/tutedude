import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { handleChange } from "@/lib/utils";
import api from "@/services/axios";
import { ApiError, LoginError, LoginProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorDisplay from "../error/ErrorDisplay";

export function Login() {
  const navigate = useNavigate();
  const { user: loggedInUser, loading: authLoading, login } = useAuth();
  const [formData, setFormData] = useState<LoginProps>({
    loginIdentifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (loggedInUser?._id && !authLoading) {
      navigate("/home", { replace: true });
      return;
    }
  }, [authLoading, loggedInUser?._id, navigate]);

  const mutation = useMutation({
    mutationFn: (data: LoginProps) => {
      return api.post(`/api/v1/auth/login`, data);
    },
    onSuccess: (data) => {
      login({
        user: data.data.user,
      });

      navigate("/home");
      console.log("Success logging in");
    },
    onError: (error: ApiError<LoginError>) => {
      console.error("Error logging in:", error);
    },
  });

  const { mutate, isPending: isLoading, isError, error, isSuccess } = mutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="loginIdentifier"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="loginIdentifier"
              name="loginIdentifier"
              type="email"
              autoComplete="loginIdentifier"
              required
              className="mt-1 bg-white text-gray-700"
              placeholder="you@example.com"
              disabled={isLoading}
              value={formData.loginIdentifier}
              onChange={(e) =>
                handleChange({ e, data: formData, setData: setFormData })
              }
            />
          </div>
          <div>
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="pr-10 mt-1 bg-white text-gray-700"
                placeholder="••••••••"
                disabled={isLoading}
                value={formData.password}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-black hover:text-black"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-6 w-6" />
                ) : (
                  <Eye className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </div>
      </form>

      <div className="flex justify-center items-center">
        <ErrorDisplay isError={isError} error={error} />
        {isSuccess && <p style={{ color: "green" }}>Login successful!</p>}
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link to={"/auth/signup"}>
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-indigo-600 hover:text-indigo-500"
            disabled={isLoading}
          >
            Sign up
          </Button>
        </Link>
      </p>
    </div>
  );
}
