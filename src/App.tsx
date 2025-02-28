import React, { useState, useEffect } from "react";
import { useTimer } from "./hooks/useTimer";
import { useMeetings } from "./hooks/useMeetings";
import "./styles.css";
import { Meeting } from "./types";

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  return `${hours.toString().padStart(2, "0")}:${(minutes % 60)
    .toString()
    .padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function App() {
  const { dudeTime, notDudeTime, currentSpeaker, toggleSpeaker, resetTimers } =
    useTimer();
  const {
    meetings,
    selectedMeeting,
    saveMeeting,
    deleteMeeting,
    selectMeeting,
    startNewMeeting,
  } = useMeetings();
  const [newMeetingName, setNewMeetingName] = useState("");

  useEffect(() => {
    if (selectedMeeting) {
      setNewMeetingName(selectedMeeting.name);
    } else {
      setNewMeetingName(`Timer ${meetings.length + 1}`);
    }
  }, [meetings.length]);

  // Don't auto-save on name changes, just update the input
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMeetingName(e.target.value);
  };

  const handleMeetingSelect = (meeting: Meeting) => {
    if (
      !window.confirm(
        "Are you sure you want to replace the current timer data with this meeting's data?"
      )
    ) {
      return;
    }
    // Update both the timer values and the name field
    resetTimers(meeting.dudeTime, meeting.notDudeTime);
    setNewMeetingName(meeting.name);
  };

  const handleSaveMeeting = () => {
    // Create new meeting as a snapshot of current values
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      name: newMeetingName,
      dudeTime,
      notDudeTime,
    };
    saveMeeting(newMeeting);
    // Reset name field to default
    setNewMeetingName(`Timer ${meetings.length + 2}`);
  };

  const handleClearTimers = () => {
    if (window.confirm("Are you sure you want to clear the timers?")) {
      resetTimers(0, 0);
    }
  };

  const handleDeleteMeeting = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete meeting "${name}"?`)) {
      deleteMeeting(id);
    }
  };

  return (
    <div className="container">
      <h1>Dude Timer</h1>

      <div className="timer-display">
        <div>
          Dude Time: <span className="time">{formatTime(dudeTime)}</span>
        </div>
        <div>
          Not-Dude Time: <span className="time">{formatTime(notDudeTime)}</span>
        </div>
      </div>

      <div className="buttons">
        <div className="button-row">
          <div className="button-column">
            <button
              className={`button dude ${
                currentSpeaker === "dude" ? "active" : ""
              }`}
              onClick={() => toggleSpeaker("dude")}
            >
              <div>Dude</div>
              <div>Speaking</div>
            </button>
            <div
              className={`time ${currentSpeaker === "dude" ? "active" : ""}`}
            >
              {formatTime(dudeTime)}
            </div>
          </div>

          <div className="button-column">
            <button
              className={`button not-dude ${
                currentSpeaker === "notDude" ? "active" : ""
              }`}
              onClick={() => toggleSpeaker("notDude")}
            >
              <div>Not-a-Dude</div>
              <div>Speaking</div>
            </button>
            <div
              className={`time ${currentSpeaker === "notDude" ? "active" : ""}`}
            >
              {formatTime(notDudeTime)}
            </div>
          </div>
        </div>

        <div className="reset-button-container">
          <button className="button reset" onClick={handleClearTimers}>
            Reset
          </button>
        </div>
      </div>

      <div className="save-meeting">
        <input
          type="text"
          value={newMeetingName}
          onChange={handleNameChange}
          placeholder="Timer name"
        />
        <div className="save-actions">
          <button onClick={handleSaveMeeting}>Save Timer</button>
        </div>
      </div>

      <div className="meetings-list">
        <h2>Saved Timers</h2>
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className={`meeting-item ${
              selectedMeeting?.id === meeting.id ? "selected" : ""
            }`}
            onClick={() => handleMeetingSelect(meeting)}
          >
            <div className="meeting-info">
              <strong>{meeting.name}</strong>
              <div>
                Dude:{" "}
                <span className="time">{formatTime(meeting.dudeTime)}</span> |
                Not-Dude:{" "}
                <span className="time">{formatTime(meeting.notDudeTime)}</span>
              </div>
            </div>
            <div className="meeting-actions">
              <button
                className="button-action delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMeeting(meeting.id, meeting.name);
                }}
              >
                <span className="sr-only">Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
