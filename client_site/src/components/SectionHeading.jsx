export default function SectionHeading({ description, eyebrow, title }) {
  return (
    <div className="section-heading">
      {eyebrow ? <p className="section-eyebrow">{eyebrow}</p> : null}
      <h2 className="section-header">{title}</h2>
      {description ? <p className="section-description">{description}</p> : null}
    </div>
  );
}
