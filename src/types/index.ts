export interface Sentence {
  english: string;
  portuguese: string;
  keyPhrases: string[];
  note?: string;
}

export interface Text {
  id: number;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate';
  sentences: Sentence[];
}
