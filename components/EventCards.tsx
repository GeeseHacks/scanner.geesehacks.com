"use client";

import React, { useEffect, useState } from "react";
import { HackerEvent } from "@/types/hackerEvent";
import EventCard from "./EventCard";

const EventCards: React.FC = () => {
  const [events, setEvents] = useState<HackerEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data: HackerEvent[] = await response.json();
        setEvents(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-5">
      {loading
        ? [...Array(3)].map((_, i) => (
            <EventCard key={i} loading={true} />
          ))
        : events.filter(event => event.needsScanning).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
    </div>
  );
};

export default EventCards;
