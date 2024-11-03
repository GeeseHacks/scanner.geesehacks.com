"use client";

import React, { useEffect, useState } from "react";
import QRCodeScanner from "@/components/Scanner";
import { HackerEvent } from "@/types/hackerEvent";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, House } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

// Define the different stages for the event page
type Stage = "scanning" | "results";

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<HackerEvent | null>(null); // Initialize as null for better handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("scanning"); // String state to track the current stage
  const [eventCode, setEventCode] = useState<string>(""); // Hacker's QR Code Badge
  const router = useRouter();

  const handleBackButtonPress = () => {
    router.push("/");
  };

  // Fetch all events from the API
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data: HackerEvent[] = await response.json();

        // Filter the events to find the one with the matching ID
        const foundEvent = data.find((event) => event.id === Number(params.id)); // Adjust according to your data structure
        setEvent(foundEvent || null); // Set the found event or null if not found
      } catch (err) {
        if (err instanceof Error) {
          setFatalError(err.message);
        } else {
          setFatalError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [params.id]); // Dependency array includes params.id to refetch if it changes

  const validateQRCode = (qrCode: string): boolean => {
    return qrCode.startsWith("https://portal.geesehacks.com/user/");
  };

  const handleEventQRScan = async (scannedEventCode: string): Promise<void> => {
    // Process the scanning result
    console.log("Scan result:", scannedEventCode);

    if (!validateQRCode(scannedEventCode)) {
      setError("Invalid QR Code");
      setStage("results");
      return; // Exit the function if the QR code is invalid
    }

    setEventCode(scannedEventCode);

    // Make the API call to assign the event QR code
    try {
      const response = await fetch("/api/scan-hacker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          qrCode: scannedEventCode, // The scanned QR code
          eventId: String(event?.id), // The ID of the event
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        // Handle specific error responses
        if (response.status === 409) {
          setError("Event ID already recorded."); // Handle conflict case
        } else {
          setFatalError(
            errorData.error ||
              "An error occurred while assigning the event code"
          );
        }
        setStage("results"); // Switch to results stage
        return;
      }

      // Success handling
      const result = await response.json();
      console.log("Event assigned successfully:", result);

      // Proceed to the results stage
      setStage("results"); // Switch to results stage
    } catch (error) {
      console.error("Failed to assign event QR code:", error);
      setFatalError("An error occurred while assigning the event code");
      setStage("results");
    }
  };

  // Handle user confirmation
  const handleYesConfirmation = (): void => {
    setError("");
    setStage("scanning"); // Move to scanning stage
  };

  if (loading) {
    return (
      <div className="w-full h-screen p-4 flex flex-col items-center">
        <Skeleton className="h-8 w-72 my-2" />
        <Skeleton className="h-6 w-52 my-2" />
        <Skeleton className="h-6 w-60 mt-4" />
        <Skeleton className="h-full w-full mt-4 rounded-xl" />
      </div>
    );
  }

  if (!event) {
    return <div>No event found.</div>; // Handle case where event is null
  }

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

      <h1 className="text-3xl pt-4">Event Scanning</h1>
      {stage === "scanning" && (
        <QRCodeScanner
          setScannedData={handleEventQRScan}
          title={event.name}
        />
      )}
      {stage === "results" && (
        <div className="h-full w-full flex flex-col justify-between">
          <div className="flex flex-col gap-4 my-4">
            {error != "" && (
              <div className="bg-red-200 text-red-800 p-4 rounded-md text-center">
                ❌ {error} ❌
              </div>
            )}
            {error == "" && (
              <div className="bg-green-200 text-green-800 p-4 rounded-md text-center">
                🎉 Success! 🎉
              </div>
            )}
          </div>

          <div className="flex flex-row gap-4 w-full justify-center mt-4">
            <Button
              className="w-full h-12 bg-[#007bff]"
              onClick={handleYesConfirmation}
              size="icon"
            >
              <Check className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
