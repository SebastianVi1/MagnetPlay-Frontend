import Layout from "../components/Layout/Layout";
import About from "../pages/about/About";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";

import type { ReactNode } from "react";

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
    path: "/about",
    element: (
      <Layout showNav={true} showSidebar={false}>
        <About />
      </Layout>
    ),
    title: "About",
  },
];

export default routes;
