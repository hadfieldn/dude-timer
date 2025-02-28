import { useState, useEffect } from "react";
import { Meeting } from "../types";

export const useMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("meetings");
    if (stored) {
      setMeetings(JSON.parse(stored));
    }
  }, []);

  const saveMeeting = (meeting: Meeting) => {
    const updatedMeetings = [...meetings, meeting];
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
  };

  const deleteMeeting = (id: string) => {
    const updatedMeetings = meetings.filter((m) => m.id !== id);
    setMeetings(updatedMeetings);
    localStorage.setItem("meetings", JSON.stringify(updatedMeetings));
  };

  return {
    meetings,
    saveMeeting,
    deleteMeeting,
  };
};
