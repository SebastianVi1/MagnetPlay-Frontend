import axios from "axios";
import type { MovieModel } from "../models/movieModel";


export async function getMovieById(id: number): Promise<MovieModel> {
  try {
    console.log("starting get movie by id");
    const res = await axios.get<MovieModel>(`/api/movies/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log("Done");
  }
}

export async function getFavoriteMovies(userId: number) {
  try {
    const response = await axios.get( `users/${userId}/favorites`);
    return response.data;
  } catch (err) {
    console.log("Failed to fetch favorite movies:", err);
    throw err;
  }
}

