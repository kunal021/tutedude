import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { handleChange } from "@/lib/utils";
import api from "@/services/axios";
import { ApiError, SignupError, SignupProps } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, UserSearch } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ErrorDisplay from "../error/ErrorDisplay";
import { useToast } from "@/hooks/useToast";

export function Signup() {
  const { user: loggedInUser, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupProps>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (loggedInUser?._id && !authLoading) {
      navigate("/home");
    }
  }, [authLoading, loggedInUser?._id, navigate]);

  const signupMutation = useMutation({
    mutationFn: (data: SignupProps) => {
      return api.post(`/api/v1/auth/signup`, data);
    },
    onSuccess: () => {
      navigate("/auth/login");
      console.log("Success signing up");
    },
    onError: (error: ApiError<SignupError>) => {
      console.error("Error signing up:", error);
    },
  });

  const {
    mutate,
    isPending: isLoading,
    isError,
    error,
    isSuccess,
  } = signupMutation;

  const userNameMutation = useMutation({
    mutationFn: (userName: string) => {
      return api.post(`/api/v1/auth/username-exists`, {
        userName,
      });
    },
    onSuccess: () => {
      console.log("Success checking username");
      showToast("success", "Username available", "bottom-right", 2000);
    },
    onError: (error: ApiError<SignupError>) => {
      console.error("Error checking username:", error);
      showToast("error", "Username already exists", "bottom-right", 2000);
    },
  });

  const {
    mutate: checkUserName,
    isPending: userNameLoading,
    isSuccess: isUserNameSuccess,
    error: userNameError,
    isError: isUserNameError,
  } = userNameMutation;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(formData);
  };

  const handleUserNameChange = () => {
    checkUserName(formData.userName);
  };

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Create an account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Enter your details to create your account
        </p>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <div className="w-full">
              <Label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                className="mt-1 bg-white text-gray-700"
                placeholder="John"
                disabled={isLoading}
                value={formData.firstName}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
            </div>
            <div className="w-full">
              <Label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                className="mt-1 bg-white text-gray-700"
                placeholder="Doe"
                disabled={isLoading}
                value={formData.lastName}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
            </div>
          </div>
          <div>
            <Label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700"
            >
              User Name
            </Label>
            <div className="relative">
              <Input
                id="userName"
                name="userName"
                type="text"
                autoComplete="username"
                required
                className="pr-10 bg-white text-gray-700 mt-1"
                placeholder="johndoe"
                disabled={isLoading}
                value={formData.userName}
                onChange={(e) =>
                  handleChange({ e, data: formData, setData: setFormData })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={userNameLoading}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-black hover:text-black"
                onClick={handleUserNameChange}
              >
                {userNameLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <UserSearch className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 bg-white text-gray-700"
              placeholder="you@example.com"
              disabled={isLoading}
              value={formData.email}
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
                autoComplete="new-password"
                required
                className="pr-10 bg-white text-gray-700 mt-1"
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
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </div>
      </form>

      <div className="flex justify-center items-center">
        <ErrorDisplay isError={isError} error={error} />
        {isSuccess && <p style={{ color: "green" }}>Signup successful!</p>}
      </div>

      <div className="flex justify-center items-center">
        <ErrorDisplay isError={isUserNameError} error={userNameError} />
        {isUserNameSuccess && (
          <p style={{ color: "green" }}>Username Available</p>
        )}
      </div>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to={"/auth/login"}>
          <Button
            variant="link"
            className="p-0 h-auto font-semibold text-indigo-600 hover:text-indigo-500"
            disabled={isLoading}
          >
            Log in
          </Button>
        </Link>
      </p>
    </div>
  );
}
