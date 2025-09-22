import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



//import Login from "../Authentication/Login";
//import Signup from "../Authentication/SignUp";

import { AppLayout } from "../Layouts/AppLayout";
import LandingPage from "./LandingPage";
import { ErrorPage } from "../Layouts/ErrorPage";
import AdminDashboard from "../components/Pages/AdminDashboard";
//import AgentDashboard from "../components/Pages/AgentFeatures/AgentDashboard";
import UsersDetail from "../components/Pages/AdminFeatures/UserDetail";
import AgentsDetail from "../components/Pages/AdminFeatures/AgentDetail";
import ApprovedAgents from "../components/Pages/AdminFeatures/ApprovedAgent";
import PendingAgents from "../components/Pages/AdminFeatures/PendingAgent";
import DashboardLayout from "../Layouts/DashBoardLayout";
import AdminProperties from "../components/Pages/AdminFeatures/AdminProperties";
import AllProperties from "../components/AllProperties";
import SearchResults from "../components/SearchResult";
import PropertyList from "../components/PropertyList";
import PropertyDetails from "../components/PropertyDetails";
import CityProperties from "../components/CityProperties";
import PropertiesByPurpose from "../components/propertybypurpose";
import AgentList from "../components/AgentList";
import Dashboard from "../components/Pages/UserFeatures/Dashboard";

import UserMessages from "../components/Pages/UserFeatures/UserMessages";
import FavoritesPage from "../components/Favourites/FavouritePage";
import ComparePage from "../components/Compare/ComparePage";
import ResetPassword from "../components/Auth/ResetPassword";
import AboutPage from "../Layouts/About";
import AdminFeatureApprovals from "../components/Pages/AdminFeatures/AdminFeatureApproval";

export const AppRoutes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          index: true, // same as path: "/"
          element: <LandingPage />,
        },
        {
         path: "admin-dashboard",
          element: <AdminDashboard />,
        },
        {
         path: "agent-dashboard",
          element: <DashboardLayout />,
        },
        {
         path: "/admin/users-detail",
          element: <UsersDetail />,
        },
        {
         path: "/admin/agents-detail",
          element: <AgentsDetail />,
        },
         {
         path: "/admin/pending-agents",
          element: <PendingAgents />,
        },
         {
         path: "/admin/approved-agents",
          element: <ApprovedAgents />,
        },
         {
         path: "/admin/all-properties",
          element: <AdminProperties />,
        },
         {
         path: "/properties",
          element: <AllProperties />,
        },
         {
         path: "/search",
          element: <SearchResults />,
        },
         {
         path: "/properties/type/:type",
          element: <PropertyList />,
        },
        {
         path: "/properties/:id",
          element: <PropertyDetails />,
        },
        {
         path: "/properties/city/:city" ,
          element: <CityProperties />,
        },
       {
          path: "/properties/status/:status",
          element: <PropertiesByPurpose />,
        },
         // ✅ Column-based routes
        { path: "/properties/2-columns", element: <AllProperties columns={2} /> },
        { path: "/properties/3-columns", element: <AllProperties columns={3} /> },
      //  { path: "/properties/4-columns", element: <AllProperties columns={4} /> },
       { path: "/members/agents", element: <AgentList /> },
       {
         path: "/dashboard",
          element: <Dashboard />,
        },
         {
          path: "/dashboard/messages",
            element: <UserMessages />,
        },
        {
          path: "/favorites",
            element: <FavoritesPage />,
        },
        {
          path: "/compare",
            element: <ComparePage />,
        },
       {
          path: "/about",
            element: <AboutPage />,
        },
        {
          path: "/admin/feature-approval",
            element: <AdminFeatureApprovals />,
        },
     
 //       {
   //       path: "login",
     //     element: <Login />,
       // },
        //{
         // path: "signup",
          //element: <Signup />,
        //},
      ],
    },
   
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
     
  ]);

  return <RouterProvider router={router} />;
};
