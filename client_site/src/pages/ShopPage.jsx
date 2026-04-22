import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import LookbookPanel from "../components/LookbookPanel";
import ProductCard from "../components/ProductCard";
import SectionHeading from "../components/SectionHeading";

export default function ShopPage({ lookbookEntries, onAddToCart, products }) {
  const location = useLocation();
  const [lookbookQuery, setLookbookQuery] = useState("");

  useEffect(() => {
    document.title = "Shop - AURUM";
  }, [location.pathname]);

  const filteredEntries = lookbookEntries.filter((entry) => {
    const searchableText = `${entry.title} ${entry.note} ${entry.tags.join(" ")}`.toLowerCase();
    return searchableText.includes(lookbookQuery.trim().toLowerCase());
  });

  return (
    <>
      <LookbookPanel
        entries={filteredEntries}
        onQueryChange={setLookbookQuery}
        query={lookbookQuery}
      />

      <section className="content-section">
        <SectionHeading
          description="Every product card is rendered from array data with props, local state, and immutable cart updates."
          eyebrow="Shop"
          title="THE COLLECTION"
        />
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} onAddToCart={onAddToCart} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
