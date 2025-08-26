import Layout from "../components/Layout/Layout";
import About from "../pages/about/About";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";

import type { ReactNode } from "react";
import Register from "../pages/register/Register";
import Favorites from "../pages/favorites/Favorites";
import MovieDetails from "../pages/movie_details/MovieDetails";

export interface AppRoute {
  path: string;
  element: ReactNode;
  title?: string;
  requiresAuth?: boolean;
  showNav?: boolean;
  showSidebar?: boolean;
}

export const routes: AppRoute[] = [
  {
    path: "/",
    element: (
      <Layout showNav={true} showSidebar={true}>
        <Home />
      </Layout>
    ),
    title: "Home",
  },
  {
    path: "/login",
    element: (
      <Layout showNav={false} showSidebar={false}>
        <Login />
      </Layout>
    ),
    title: "Login",
  },
  {
    path: "/register",
    element: (
      <Layout showNav={false} showSidebar={false}>
        <Register></Register>
      </Layout>
    ),
    title: "Register",
  },
  {
    path: "/favorites",
    element: (
      <Layout showNav={true} showSidebar={true}>
        <Favorites />
      </Layout>
    ),
    title: "Favorites",
  },
  {
    path: "/about",
    element: (
      <Layout showNav={true} showSidebar={false}>
        <About />
      </Layout>
    ),
    title: "About",
  },
  {
    path: "/movie/:movieId",
    element: (
      <Layout showNav={true} showSidebar={true}>
        <MovieDetails />
      </Layout>
    ),
    title: "Details",
  },
];

export default routes;
