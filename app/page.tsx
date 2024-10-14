import EventCards from "@/components/EventCards";

export default function Home() {
  return (
    <div>
      {/* TODO: Warn if not using phone */}
      <h1 className="text-center text-4xl font-md my-8">
        GeeseHacks ID Scanner
      </h1>
      <EventCards />
    </div>
  );
}
