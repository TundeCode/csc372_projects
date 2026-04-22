import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import Footer from "./Footer";
import NavBar from "./NavBar";

export default function Layout({ cartCount }) {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <AnnouncementBanner />
      <NavBar cartCount={cartCount} />
      <main className="main-content">
        <Outlet />
      </main>
      <AnnouncementBanner reverse />
      <Footer />
    </div>
  );
}
