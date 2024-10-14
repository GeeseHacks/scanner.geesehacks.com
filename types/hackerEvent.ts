export type HackerEvent = {
    id: number;
    startTime: Date;
    endTime: Date;
    name: string;
    eventType: string;
    location: string;
    details: string;
    needsScanning?: boolean;
  };
  