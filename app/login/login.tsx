"use client";
import React, { useState, useEffect } from "react";
import { authenticate } from "@lib/actions";
import Link from "next/link";
import Image from "next/image";
import { validatePassword } from "@/lib/passwordUtils";
import { validateEmail } from "@/lib/emailUtils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { BiHide } from "react-icons/bi";
import { BiShow } from "react-icons/bi";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [emailError, setEmailError] = useState<string>("");
  const [isButtonActive, setIsButtonActive] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const emailValidationError = validateEmail(email);
    const passwordValidationErrors = validatePassword(password);

    if (emailValidationError || passwordValidationErrors.length > 0) {
      setEmailError(emailValidationError);
      setPasswordErrors(passwordValidationErrors);
    } else {
      setEmailError("");
      setPasswordErrors([]);

      toast.promise(authenticate(email, password), {
        loading: "Logging in...",
        success: (response) => {
          if (response && response.error) {
            throw new Error(response.error); // Throwing the error to be caught by the error handler
          }
          return "Logged in successfully!";
        },
        error: (err) => {
          return err.message || "Failed to log in";
        },
      });
    }
  };

  useEffect(() => {
    setIsButtonActive(email !== "" && password !== "");
  }, [email, password]);

  return (
    <div className="flex h-screen">
      <div className="bg-gray-900 text-white flex flex-col justify-center items-start w-full sm:w-1/2 min-w-[300px] px-8 sm:px-12 lg:px-24 xl:px-40 2xl:px-[13%]">
        <h2 className="mt-2 mb-2 text-left text-4xl font-bold">Welcome</h2>
        <p className="mb-6 mt-3 text-left">Log in to GeeseHacks Scanner!</p>
        <form className="flex flex-col gap-4 w-full" noValidate>
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

          <div className="flex flex-row justify-between items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <div className="relative">
            <Input
              type={passwordVisibility ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Your password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-11"
            />
            <div
              onClick={() => setPasswordVisibility((prev) => !prev)}
              className="password-toggle-icon absolute inset-y-0 right-3 flex items-center cursor-pointer"
            >

              {passwordVisibility ? (
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
          <Button
            // ======= Handle form submit ========
            onClick={handleClick}
            aria-disabled={isButtonActive ? "false" : "true"}
            // ===================================
            type="submit"
            className={`py-2 mt-4`}
            disabled={!isButtonActive}
          >
            Log in
          </Button>
        </form>
      </div>
      <div
        className="bg-cover bg-center w-0 sm:w-1/2"
        style={{ backgroundImage: "url('/static/images/background.png')" }}
      ></div>
    </div>
  );
};

export default Login;
