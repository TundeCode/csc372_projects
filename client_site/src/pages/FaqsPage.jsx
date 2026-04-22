import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FAQItem from "../components/FAQItem";
import SectionHeading from "../components/SectionHeading";

export default function FaqsPage({ faqEntries }) {
  const location = useLocation();
  const [openFaqId, setOpenFaqId] = useState(faqEntries[0]?.id || "");

  useEffect(() => {
    document.title = "FAQs - AURUM";
  }, [location.pathname]);

  function handleToggleFaq(faqId) {
    setOpenFaqId((currentOpenId) => (currentOpenId === faqId ? "" : faqId));
  }

  return (
    <section className="content-section faq-page">
      <SectionHeading
        description="Got questions? We&apos;ve got answers. If you don&apos;t see what you&apos;re looking for, use the hotline form."
        eyebrow="Frequently Asked Questions"
        title="FAQS"
      />

      <div className="faq-section">
        {faqEntries.map((entry) => (
          <FAQItem
            answer={entry.answer}
            isOpen={openFaqId === entry.id}
            key={entry.id}
            onToggle={() => handleToggleFaq(entry.id)}
            question={entry.question}
          />
        ))}
      </div>
    </section>
  );
}
