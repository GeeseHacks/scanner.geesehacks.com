import React from "react";
import { useRouter } from "next/navigation";
import { HackerEvent } from "@/types/hackerEvent";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface EventCardProps {
  event?: HackerEvent;
  loading?: boolean;
}

const eventTypeColors: Record<string, string> = {
  "Workshop": "text-blue-400",
  "Food": "text-green-400",
  "Activities": "text-yellow-400",
  "Ceremonies": "text-red-400",
};

const EventCard: React.FC<EventCardProps> = ({ event, loading }) => {
  const router = useRouter();

  const handleCardClick = () => {
    if (event) {
      router.push(`/events/${event.id}`);
    }
  };

  return (
    <Card
      className="shadow-[0_4px_40px_rgba(255,255,255,0.00)] bg-[#1c2d44] bg-opacity-100 mb-2 rounded-3xl border-none cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="mb-0 pb-4">
        {/* Event Type */}
        {loading ? (
          <Skeleton className="h-4 w-20 mb-2" />
        ) : (
          <span className={`text-md ${eventTypeColors[event?.eventType || ""] || "text-gray-400"}`}>
            {event?.eventType}
          </span>
        )}

        {/* Event Time */}
        <h1 className="text-2xl text-gray-200 m-0">
          {loading ? (
            <Skeleton className="h-6 w-40 mb-2" />
          ) : (
            `${new Date(event!.startTime).toLocaleString([], { hour: "numeric", minute: "2-digit", hour12: true })} - ${new Date(event!.endTime).toLocaleString([], { hour: "numeric", minute: "2-digit", hour12: true })}`
          )}
        </h1>

        {/* Event Date */}
        {loading ? (
          <Skeleton className="h-4 w-20 mb-2" />
        ) : (
          <span className="text-sm text-gray-400">
            {new Date(event!.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </CardHeader>

      <CardContent>
        {/* Event Name */}
        {loading ? (
          <Skeleton className="h-8 w-3/4 mt-1" />
        ) : (
          <h1 className="text-2xl text-[#F1F1F1] font-bold">{event?.name}</h1>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCard;
