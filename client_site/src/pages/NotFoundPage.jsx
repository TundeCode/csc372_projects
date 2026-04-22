import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SectionHeading from "../components/SectionHeading";

export default function NotFoundPage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "404 - AURUM";
  }, [location.pathname]);

  return (
    <section className="content-section cart-section">
      <SectionHeading
        description="That page is off the line. Head back to the collection and keep moving."
        eyebrow="404"
        title="PAGE NOT FOUND"
      />
      <Link className="primary-button" to="/">
        RETURN HOME
      </Link>
    </section>
  );
}
