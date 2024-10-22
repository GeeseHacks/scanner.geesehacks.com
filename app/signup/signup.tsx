"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Import from next/navigation

import { validatePassword } from "@/lib/passwordUtils";
import { validateEmail } from "@/lib/emailUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    verifyPassword: false,
  });
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const [verifyPasswordError, setVerifyPasswordError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    const passwordValidationErrors = validatePassword(password);

    if (emailValidationError || passwordValidationErrors.length > 0) {
      setEmailError(emailValidationError);
      setPasswordErrors(passwordValidationErrors);
    } else {
      setEmailError("");
      setPasswordErrors([]);

      if (password !== verifyPassword) {
        setVerifyPasswordError("Passwords do not match");
        return;
      }

      setVerifyPasswordError("");

      // Show a promise toast while waiting for the API response
      const promise = fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }).then(async (response) => {
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to register user");
        }
        return response.json();
      });

      toast
        .promise(promise, {
          loading: "Registering user...",
          success: "User registered successfully!",
          error: (err) => err.message,
        })
        .then((data) => {
          console.log("Success:", data);
          router.push("/login"); // Redirect to the login page on success
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    const arePasswordsMatching = password === verifyPassword;
    setVerifyPasswordError(
      arePasswordsMatching ? "" : "Passwords do not match"
    );
    setIsButtonActive(email !== "" && password !== "" && arePasswordsMatching);
  }, [email, password, verifyPassword]);

  return (
    <div className="flex h-screen">
      <div className="bg-gray-900 text-white flex flex-col justify-center items-start w-full sm:w-1/2 min-w-[300px] px-8 sm:px-12 lg:px-24 xl:px-40 2xl:px-[13%]">
        <h2 className="mt-2 mb-2 text-left text-4xl font-bold">Welcome</h2>
        <p className="mb-6 mt-3 text-left">
          Make an account with us to continue!
        </p>
        <div className="flex items-center w-full mb-4">
          <div className="border-t border-gray-600 flex-grow mr-2"></div>
          <span className="text-gray-500">OR</span>
          <div className="border-t border-gray-600 flex-grow ml-2"></div>
        </div>
        <form
          className="flex flex-col gap-4 w-full"
          onSubmit={handleSubmit}
          noValidate
        >
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Your email address"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && (
            <p role="alert" className="text-red-500 text-sm mt-2">
              {emailError}
            </p>
          )}
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              type={passwordVisibility.password ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-11"
            />
            <div

              onClick={() =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {passwordVisibility.password ? (
                <BiHide className="mr-1 text-xl" />
              ) : (
                <BiShow className="mr-1 text-xl" />
              )}
            </div>
          </div>
          {passwordErrors.length > 0 && (
            <ul
              role="alert"
              className="text-red-500 text-sm mt-2 list-disc list-inside"
            >
              {passwordErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}

          <Label htmlFor="verify-password">Verify Password</Label>
          <div className="relative">
            <Input
              type={passwordVisibility.verifyPassword ? "text" : "password"}
              id="verify-password"
              name="verify-password"
              placeholder="Verify your password"
              required
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="pr-11"
            />
            <div
              onClick={() =>
                setPasswordVisibility((prev) => ({
                  ...prev,
                  verifyPassword: !prev.verifyPassword,
                }))
              }
              className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >
              {passwordVisibility.verifyPassword ? (
                <BiHide className="mr-1 text-xl" />
              ) : (
                <BiShow className="mr-1 text-xl" />
              )}
            </div>
          </div>
          {verifyPasswordError && (
            <p role="alert" className="text-red-500 text-sm mt-2">
              {verifyPasswordError}
            </p>
          )}
          <Button
            type="submit"
            className={`py-2 mt-4`}
            disabled={!isButtonActive}
          >
            Sign Up
          </Button>
        </form>
        <div className="flex w-full">
          <p className="mt-4 text-gray-400 text-center text-sm w-full">
            Already have an account?{" "}
            <Link href="/login">
              <Button variant="link" className="text-blue-400 p-0 h-auto">
                Log in
              </Button>
            </Link>
          </p>
        </div>
      </div>
      <div
        className="bg-cover bg-center w-0 sm:w-1/2"
        style={{ backgroundImage: "url('/static/images/background.png')" }}
      ></div>
    </div>
  );
};

export default SignUp;
