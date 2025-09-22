export type MovieModel = {
  id: number;
  name: string;
  description: string;
  category: string;
  poster: string;
  magnetUri: string;
  genres: Array<string>;
  screenshot: Array<string>;
};
