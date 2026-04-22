import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import FeatureCard from "../components/FeatureCard";
import SectionHeading from "../components/SectionHeading";

export default function HomePage({ featuredMoments, featuredProducts }) {
  const location = useLocation();

  useEffect(() => {
    document.title = "AURUM - 1800 Drop";
  }, [location.pathname]);

  return (
    <>
      <section className="hero">
        <div className="hero-badge">WE CARRY GOLD</div>
        <h1>CALL 1800-AURUM</h1>
        <div className="hero-subtitle">OPERATORS ARE STANDING BY</div>
        <p className="hero-description">
          It&apos;s time to pick up. The 1800 Drop isn&apos;t just a collection - it&apos;s a
          call to those who move different. Inspired by late-night conversations, missed
          connections, and the power of showing up as yourself, this drop taps into
          nostalgia with a modern edge. Boxy silhouettes, clean lines, and bold graphics
          speak louder than words. This is more than a look. It&apos;s a message. And the line
          is open.
        </p>
        <div className="hero-actions">
          <Link className="primary-button" to="/shop">
            SHOP THE DROP
          </Link>
          <Link className="secondary-button" to="/hotline">
            CONTACT HOTLINE
          </Link>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          description="The original site voice, reorganized into reusable React content blocks."
          eyebrow="Featured Moments"
          title="WHY THE DROP HITS"
        />
        <div className="feature-grid">
          {featuredMoments.map((moment) => (
            <FeatureCard key={moment.id} text={moment.text} title={moment.title} />
          ))}
        </div>
      </section>

      <section className="content-section">
        <SectionHeading
          description="A quick preview of the same collection now rendered from React data."
          eyebrow="Dynamic Cards"
          title="DROP PREVIEW"
        />
        <div className="preview-grid">
          {featuredProducts.map((product) => (
            <article className="preview-card" key={product.id}>
              <img alt={product.name} className="preview-image" src={product.image} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
