export type MovieModel = {
  id: number;
  name: string;
  description: string;
  category: string;
  posterUri: string;
  magnetUri: string;
  genres: Array<string>;
  screenshot: Array<string>;
  tmdbPosterUrl?: string;
  tmdbBackdropUrl?: string;
  tmdbRating?: number;
  tmdbOverview?: string;
  releaseDate?: string;
  runtime?: number;
  tmdbId?: number;
};
