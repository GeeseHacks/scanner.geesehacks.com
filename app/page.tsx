"use client"

import EventCards from "@/components/EventCards";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleCheckinRedirect = () => {
    router.push("/checkin");
  };

  return (
    <div className="p-6">
      {/* TODO: Warn if not using phone */}
      <h1 className="text-center text-4xl font-md my-2">
        GeeseHacks ID Scanner
      </h1>

      <div className="flex flex-col gap-2">

      <h1 className="mt-4">Check-in</h1>
      <Button onClick={handleCheckinRedirect}>Check-in</Button>
      <h1 className="mt-4">Events</h1>
      <EventCards />
      </div>
    </div>
  );
}
