import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { Card } from "@/components/ui/card";

interface LunarCalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
}

export default function LunarCalendar({ onDateSelect, selectedDate }: LunarCalendarProps) {
  return (
    <Card className="card-glass p-6 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Calendario Lunar
      </h2>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect(date)}
        className="rounded-md border-0"
      />
    </Card>
  );
}
