import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import SectionHeading from "../components/SectionHeading";

export default function HotlinePage() {
  const location = useLocation();

  useEffect(() => {
    document.title = "Hotline - AURUM";
  }, [location.pathname]);

  return (
    <section className="content-section hotline-page">
      <SectionHeading
        description="Questions about sizing, shipping, or your order? Need clarity before you call 1800-AURUM? Tap in directly."
        eyebrow="Hotline"
        title="OPERATORS ARE STANDING BY"
      />

      <div className="hotline-layout">
        <div className="hotline-copy">
          <p>DM us on Instagram: @aurum79.us</p>
          <p>We check messages daily. No bots. No scripts. Just real responses.</p>
          <p className="hotline-tagline">THE LINE IS OPEN.</p>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
