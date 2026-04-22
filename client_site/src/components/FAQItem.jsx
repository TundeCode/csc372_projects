export default function FAQItem({ answer, isOpen, onToggle, question }) {
  return (
    <article className="faq-item">
      <button
        aria-expanded={isOpen}
        className="faq-toggle"
        onClick={onToggle}
        type="button"
      >
        <span className="faq-question">{question}</span>
        <span className="faq-symbol">{isOpen ? "-" : "+"}</span>
      </button>
      {isOpen ? <p className="faq-answer">{answer}</p> : null}
    </article>
  );
}
