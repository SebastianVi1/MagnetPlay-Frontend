export type MovieModel = {
  id: number;
  name: string;
  description: string;
  category: string;
  posterUri: string;
  magnetUri: string;
  genres: Array<string>;
  screenshot: Array<string>;
};
