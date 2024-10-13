"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button"


export type HackerEvent = {
  id: string;
  title: string;
  location: string;
  date: Date;
  details: string;
}

// MORE DUMMY DATA (to be integreated with spreadsheet)
export const events: HackerEvent[] = [
  {
    id: '1',
    title: 'Opening Ceremony',
    location: 'Main Stage',
    date: new Date('2022-01-15'),
    details: 'Join us for the opening ceremony of GeeseHacks 2022!'
  },
  {
    id: '2',
    title: 'Workshop: Intro to React',
    location: 'Workshop Room',
    date: new Date('2022-01-15'),
    details: 'Learn the basics of React, a popular JavaScript library for building user interfaces.'
  },
  {
    id: '3',
    title: 'Workshop: Intro to Tailwind CSS',
    location: 'Workshop Room',
    date: new Date('2022-01-15'),
    details: 'Discover the power of Tailwind CSS, a utility-first CSS framework.'
  },
  {
    id: '4',
    title: 'Lunch Break',
    location: 'N/A',
    date: new Date('2022-01-15'),
    details: 'Take a break and refuel for the rest of the day!'
  },
  {
    id: '5',
    title: 'Hackathon Begins',
    location: 'Main Hall',
    date: new Date('2022-01-15'),
    details: 'Start hacking on your project and bring your ideas to life!'
  },
  {
    id: '6',
    title: 'Mentorship Hours',
    location: 'Mentorship Room',
    date: new Date('2022-01-15'),
    details: 'Get help from experienced mentors to guide you through your project.'
  },
];

export const columns: ColumnDef<HackerEvent>[] = [
  { accessorKey: 'title', header: 'Event' },
  {
    accessorKey: 'date', header: "Time", cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return <div>{formatted}</div>
    }
  },
  {
    id: "actions", cell: ({ row }) => {
      return <Link className={buttonVariants({ variant: "default" })} href={`/events/${row.id}`}>Open</Link>

    }
  }
]