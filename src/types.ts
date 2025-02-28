export interface Meeting {
  id: string;
  name: string;
  dudeTime: number;
  notDudeTime: number;
}

export type SpeakerType = "dude" | "notDude" | null;
