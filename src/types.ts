export interface Meeting {
  id: string;
  name: string;
  dudeTime: number;
  notDudeTime: number;
  savedAt: string;
}

export type SpeakerType = "dude" | "notDude" | null;
