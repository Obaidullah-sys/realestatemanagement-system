import { Outlet, useLocation, useNavigation } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";
import AdminHeader from "../components/HeaderUser/AdminHeader";
import AgentHeader from "../components/HeaderUser/AgentHeader";
import { useEffect } from "react";

export const AppLayout = () => {
  const navigation = useNavigation();
  const location = useLocation();

  const path = location.pathname;

  // ✅ Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" }); 
    // 👉 use "smooth" instead of "instant" if you prefer animation
  }, [location.pathname]);

  // Choose correct header
  let HeaderComponent = Header;
  if (path.startsWith("/admin")) {
    HeaderComponent = AdminHeader;
  } else if (path.startsWith("/agent")) {
    HeaderComponent = AgentHeader;
  }

  if (navigation.state === "loading") return <p>Loading......</p>;

  return (
    <>
      <HeaderComponent />
      <Outlet />
      <Footer />
    </>
  );
};
