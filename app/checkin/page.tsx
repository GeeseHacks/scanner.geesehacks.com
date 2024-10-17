"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, House } from "lucide-react";
import QRCodeScanner from "@/components/Scanner";
import { useRouter } from "next/navigation";

interface HackerInfo {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  accepted: boolean;
}

// Define the different stages
type Stage =
  | "checkin_scanning"
  | "querying"
  | "verify"
  | "assignment_scanning"
  | "assignment"
  | "success";

export default function Checkin() {
  const [email, setEmail] = useState<string>("");
  const [hackerInfo, setHackerInfo] = useState<HackerInfo | null>(null);
  const [eventCode, setEventCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]); // Changed to an array of strings
  const [stage, setStage] = useState<Stage>("checkin_scanning"); // State to track the stage
  const router = useRouter();

  const handleBackButtonPress = () => {
    router.push("/");
  };

  // Fetch hacker info when email is updated
  useEffect(() => {
    if (email) {
      setStage("querying"); // Enter querying stage when email is scanned
      fetchHackerInfo(email);
    }
  }, [email]);

  // Fetch hacker info from the database when email is scanned
  const fetchHackerInfo = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`/api/users/${encodeURIComponent(email)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.status === 200) {
        setHackerInfo(data);
        setError("");

        const newWarnings: string[] = []; // Create a new warnings array

        if (!data.accepted) {
          newWarnings.push("Warning: Hacker is not accepted.");
        }
        if (data.event_qr_code != null) {
          newWarnings.push("Warning: Hacker already checked in.");
        }

        setWarnings(newWarnings); // Set the warnings array
      } else if (response.status === 404) {
        setError("Hacker not found");
        setHackerInfo(null);
      } else if (response.status === 400) {
        setError("Scanned QR Code is not an email");
        setHackerInfo(null);
      } else {
        setFatalError("Error fetching hacker information.");
      }
      setStage("verify");
    } catch (error) {
      setFatalError("Error fetching hacker information.");
      console.error(error);
      setStage("checkin_scanning");
    }
  };

  // Perform the QR code validation
  const validateQRCode = (qrCode: string): boolean => {
    return qrCode.startsWith("https://portal.geesehacks.com/user/");
  };

  // Handle the event QR scan and save it to the database
  const handleEventQRScan = (scannedEventCode: string): void => {
    // Validate the scanned event code
    if (!validateQRCode(scannedEventCode)) {
      setError("Invalid QR Code");
    }
    setEventCode(scannedEventCode);

    if (error != "" || warnings.length > 0) {
      setStage("assignment");
    } else {
      if (hackerInfo != null) {
        saveEventQRCodeToDatabase(scannedEventCode, hackerInfo.email);
      }
    }
  };

  // Save the event association in the database using the hacker's email
  const saveEventQRCodeToDatabase = async (
    qrCode: string,
    email: string
  ): Promise<void> => {
    try {
      const response = await fetch("/api/assign-event-qrcode", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ qrCode, email }), // Pass email instead of ID
      });

      if (response.status === 200) {
        setError("Event successfully associated with the hacker.");
        setStage("success"); // Move to success stage upon successful API response
      } else {
        console.log(response);
        setFatalError("Error associating event with the hacker.");
      }
    } catch (error) {
      setFatalError("Error associating event with the hacker.");
      console.error(error);
    }
  };

  // Handle user confirmation
  const moveToAssignmentScanning = (): void => {
    setError("");
    setStage("assignment_scanning"); // Move to assignment_scanning stage
  };

  const confirmOverwriteEventQRCode = (): void => {
    setError(""); // Clear any existing errors
    setStage("assignment_scanning"); // Move to assignment_scanning stage

    if (hackerInfo && eventCode) {
      setStage("success"); // Move to assignment_scanning stage
      // Call the function to save the event QR code to the database
      saveEventQRCodeToDatabase(eventCode, hackerInfo.email);
    }
  };

  // Function to reset the state back to checkin_scanning
  const resetCheckin = (): void => {
    setEmail(""); // Clear the email
    setHackerInfo(null); // Reset hacker info
    setEventCode(""); // Clear the event code
    setWarnings([]); // Clear warnings
    setError(""); // Clear any errors
    setStage("checkin_scanning"); // Set stage back to checkin_scanning
  };

  if (fatalError) {
    return (
      <div className="p-4 flex flex-col w-full justify-betwee gap-6">
        <Card className="bg-red-500 p-4">Error: {fatalError}</Card>

        <Button
          className="w-full"
          onClick={handleBackButtonPress}
          variant="outline"
          size="icon"
        >
          Go Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center p-4">
      <Button
        className="absolute top-4 left-4"
        onClick={handleBackButtonPress}
        variant="outline"
        size="icon"
      >
        <House className="h-5 w-5" />
      </Button>

      <h1 className="text-3xl pt-4">Hacker Check-in</h1>

      {/* QR Code Scanner is shown only in the checkin_scanning or assignment_scanning stage */}
      {stage === "checkin_scanning" && (
        <QRCodeScanner
          setScannedData={setEmail}
          title={"Scan Check-in QR Code"}
        />
      )}

      {stage === "verify" && (
        <div className="w-full h-full flex flex-col justify-between">
          <div>
            <Card className="my-5 bg-[#1c2d44]">
              <CardHeader>
                <h1 className="text-xl text-center">Hacker Info</h1>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-lg text-gray-400">Name</p>
                    <h2 className="text-3xl">
                      {hackerInfo
                        ? `${hackerInfo.firstname} ${hackerInfo.lastname}`
                        : "Null"}
                    </h2>
                  </div>
                  <div>
                    <p className="text-lg text-gray-400">Email</p>
                    <h2 className="text-3xl">
                      {hackerInfo ? hackerInfo.email : "Null"}
                    </h2>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Application Status</p>
                    <h2
                      className={`text-3xl ${
                        hackerInfo
                          ? hackerInfo.accepted
                            ? "text-green-500"
                            : "text-red-500"
                          : "Null"
                      }`}
                    >
                      {hackerInfo
                        ? hackerInfo.accepted
                          ? "Accepted"
                          : "Rejected"
                        : "Null"}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warnings box for verification stage */}
            {warnings.length > 0 && (
              <div className="flex flex-col gap-4 my-4">
                {" "}
                {/* Container for spacing */}
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="bg-yellow-200 text-yellow-800 p-4 rounded-md text-center"
                  >
                    ⚠️ {warning} ⚠️ {/* Render each warning in its own box */}
                  </div>
                ))}
              </div>
            )}

            {error != "" && (
              <div className="flex flex-col gap-4 my-4">
                <div className="bg-red-200 text-red-800 p-4 rounded-md text-center">
                  ❌ {error} ❌
                </div>
              </div>
            )}
          </div>
          {/* Two buttons for Yes/No confirmation */}
          <div className="flex flex-col">
            <p className="text-xl text-center">Confirm Hacker's Identity?</p>
            <div className="flex flex-row gap-4 w-full justify-center mt-4">
              <Button
                className="w-full h-12 bg-[#dc3545]"
                onClick={resetCheckin}
                size="icon"
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                className="w-full h-12 bg-[#28a745]"
                onClick={moveToAssignmentScanning}
                size="icon"
                disabled={error != ""}
              >
                <Check className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {stage === "assignment_scanning" && (
        <QRCodeScanner
          setScannedData={handleEventQRScan}
          title={"Scan Event QR Code"}
        />
      )}

      {stage === "assignment" && (
        <div className="w-full h-full flex flex-col justify-between">
          <div>
            <Card className="my-5">
              <CardContent>
                <div className="mt-6">
                  <p className="text-lg text-gray-400">Scanned Event Code</p>
                  <h2 className="text-3xl">
                    {eventCode.startsWith(
                      "https://portal.geesehacks.com/user/"
                    ) ? (
                      <div className="flex flex-col">
                        <h2>
                          {eventCode.slice(
                            "https://portal.geesehacks.com/user/".length
                          )}
                        </h2>
                      </div>
                    ) : (
                      "Invalid Event Code"
                    )}
                  </h2>
                </div>
              </CardContent>
            </Card>

            {error != "" && (
              <div className="flex flex-col gap-4 my-4">
                <div className="bg-red-200 text-red-800 p-4 rounded-md text-center">
                  ❌ {error} ❌
                </div>
              </div>
            )}

            {/* Warnings box for verification stage */}
            {warnings.length > 0 && (
              <div className="flex flex-col gap-4 my-4">
                {" "}
                {/* Container for spacing */}
                {warnings.map((warning, index) => (
                  <div
                    key={index}
                    className="bg-yellow-200 text-yellow-800 p-4 rounded-md text-center"
                  >
                    ⚠️ {warning} ⚠️ {/* Render each warning in its own box */}
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Two buttons for Yes/No confirmation */}
          <div className="flex flex-col">
            <p className="text-xl text-center">Assign new event code anyway?</p>
            <div className="flex flex-row gap-4 w-full justify-center mt-4">
              <Button
                className="w-full h-12 bg-[#dc3545]"
                onClick={resetCheckin}
                size="icon"
              >
                <X className="h-6 w-6" />
              </Button>
              <Button
                className="w-full h-12 bg-[#28a745]"
                onClick={confirmOverwriteEventQRCode}
                size="icon"
                disabled={error != ""}
              >
                <Check className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {stage === "success" && hackerInfo && eventCode && (
        <div className="w-full h-full flex flex-col justify-between">
          <div>
            <Card className="my-5">
              <CardHeader>
                <h1 className="text-xl text-center">Hacker Info</h1>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-lg text-gray-400">Name</p>
                    <h2 className="text-3xl">
                      {hackerInfo.firstname} {hackerInfo.lastname}
                    </h2>
                  </div>
                  <div>
                    <p className="text-lg text-gray-400">Email</p>
                    <h2 className="text-3xl">{hackerInfo.email}</h2>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Application Status</p>
                    <h2
                      className={`text-3xl ${
                        hackerInfo.accepted ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {hackerInfo.accepted ? "Accepted" : "Rejected"}
                    </h2>
                  </div>

                  <div>
                    <p className="text-lg text-gray-400">Scanned Event Code</p>
                    <h2 className="text-3xl">
                      {eventCode.startsWith(
                        "https://portal.geesehacks.com/user/"
                      ) ? (
                        <div className="flex flex-col">
                          <h2>
                            {eventCode.slice(
                              "https://portal.geesehacks.com/user/".length
                            )}
                          </h2>
                        </div>
                      ) : (
                        "Invalid Event Code"
                      )}
                    </h2>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-200 text-green-800 p-4 rounded-md text-center">
              <h2>🎉 Success! Event QR code linked with hacker. 🎉</h2>
            </div>
          </div>
          <Button
            className="w-full h-12 mt-5 bg-[#007bff]"
            onClick={resetCheckin}
            size="icon"
          >
            <Check className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
