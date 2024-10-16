"use client";

import React, { useEffect, useState } from "react";
import QRCodeScanner from "@/components/Scanner";
import { HackerEvent } from "@/types/hackerEvent";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { set } from "zod";

// Define the different stages for the event page
type Stage = "scanning" | "results";

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<HackerEvent | null>(null); // Initialize as null for better handling
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("scanning"); // String state to track the current stage
  const [eventCode, setEventCode] = useState<string>(""); // Hacker's QR Code Badge

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
          setError(err.message);
        } else {
          setError("An unknown error occurred");
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
          setError(errorData.error || "An error occurred while assigning the event code");
        }
        return;
      }
  
      // Success handling
      const result = await response.json();
      console.log("Event assigned successfully:", result);
      
      // Proceed to the results stage
      setStage("results"); // Switch to results stage
    } catch (error) {
      console.error("Failed to assign event QR code:", error);
      setError("An error occurred while assigning the event code");
    }
  };
  
  
  // Handle user confirmation
  const handleYesConfirmation = (): void => {
    setError("");
    setStage("scanning"); // Move to scanning stage
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!event) {
    return <div>No event found.</div>; // Handle case where event is null
  }

  return (
    <>
      <b className="p-4">Currently selected event: {event.name}</b>
      {stage === "scanning" && (
        <QRCodeScanner
          setScannedData={handleEventQRScan}
          title={"Scan Hacker QR Code"}
        />
      )}
      {stage === "results" && (
        <div>
          {error != "" && (
            <div className="flex flex-col gap-4 my-4">
              <div className="bg-red-200 text-red-800 p-4 rounded-md text-center">
                ❌ {error} ❌
              </div>
            </div>
          )}

          {error == "" && (
            <div className="flex flex-col gap-4 my-4">
              <div className="bg-green-200 text-green-800 p-4 rounded-md text-center">
                🎉 Success! 🎉
              </div>
            </div>
          )}

          <div className="flex flex-col">
            {/* <p className="text-xl text-center">Assign new event code anyway?</p> */}
            <div className="flex flex-row gap-4 w-full justify-center mt-4 border-4">
              <Button
                className="w-full h-12"
                onClick={handleYesConfirmation}
                variant="outline"
                size="icon"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
