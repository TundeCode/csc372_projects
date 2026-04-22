import SectionHeading from "./SectionHeading";

export default function LookbookPanel({ entries, onQueryChange, query }) {
  return (
    <section className="lookbook-section">
      <SectionHeading
        description="Filter the vibe board by keyword and explore different sides of the 1800 drop."
        eyebrow="Styled With Props + State"
        title="LOOKBOOK"
      />

      <div className="lookbook-controls">
        <input
          className="lookbook-input"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search lookbook (streetwear, gold, black)"
          type="text"
          value={query}
        />
      </div>

      <div className="lookbook-grid">
        {entries.map((entry) => (
          <article className="lookbook-card" key={entry.id}>
            <div className="lookbook-image-wrap">
              <img alt={entry.title} className="lookbook-image" src={entry.image} />
            </div>
            <div className="lookbook-copy">
              <h3>{entry.title}</h3>
              <p>{entry.note}</p>
              <span>{entry.tags.join(" / ")}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
