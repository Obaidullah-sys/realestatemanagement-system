import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Pages/AgentFeatures/SideBar"; // Ensure this path is correct
import DashboardHome from "../components/Pages/AgentFeatures/DashBoardHome";
//import MyProfile from "./MyProfile";
//import Reviews from "./Reviews";
//import Messages from "./Messages";
import ViewProperties from "../components/Pages/AgentFeatures/ViewProperties";
//import MyFavorite from "./MyFavorite";
//import SavedSearch from "./SavedSearch";
//import MyPackage from "./MyPackage";
import AddProperty from "../components/Pages/AgentFeatures/AddProperties";
import Review from "../components/Pages/AgentFeatures/Review";
import Message from "../components/Pages/AgentFeatures/Message";
import Profile from "../components/Pages/AgentFeatures/Profile";
import AgentFeatureSubscription from "../components/Pages/AgentFeatures/AgentFeatureSubscription";
const DashboardLayout = () => {
  const [current, setCurrent] = useState("dashboard");
  const navigate = useNavigate();

    useEffect(() => {
    if (current === "logout") {
      // Clear auth token or user info
      localStorage.removeItem("token"); // adjust key if needed
      localStorage.removeItem("user");
      
      // Redirect to homepage
      navigate("/");
    }
  }, [current, navigate]);


  const renderContent = () => {
    switch (current) {
      case "dashboard":
        return <DashboardHome />;
      case "profile":
        return <Profile />;
      case "reviews":
        return <Review />;
      case "messages":
        return <Message />;
      case "properties":
        return <ViewProperties />;
      
      //case "saved":
        //return <SavedSearch />;
      case "AddProperty":
        return <AddProperty />;
        case "FeatureProperty":
        return <AgentFeatureSubscription />;
        
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar current={current} onChange={setCurrent} />
      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
};

export default DashboardLayout;
