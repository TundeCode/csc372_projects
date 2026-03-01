// server.js
const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();

// Handlebars setup
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Port
const PORT = process.env.PORT || 3000;

// Helper for dynamic data (1+ per page)
function baseViewData(req) {
  return {
    year: new Date().getFullYear(),
    path: req.path, // dynamic
  };
}

// Routes (each sends dynamic data)
app.get("/", (req, res) => {
  res.render("home", { ...baseViewData(req), title: "AURUM - 1800 Drop" });
});

app.get("/shop", (req, res) => {
  res.render("shop", { ...baseViewData(req), title: "Shop - AURUM" });
});

app.get("/faqs", (req, res) => {
  res.render("faqs", { ...baseViewData(req), title: "FAQs - AURUM" });
});

app.get("/hotline", (req, res) => {
  res.render("hotline", { ...baseViewData(req), title: "Hotline - AURUM" });
});

app.get("/cart", (req, res) => {
  res.render("cart", { ...baseViewData(req), title: "Cart - AURUM" });
});

// 404 catch-all (must be after routes)
app.use((req, res) => {
  res.status(404).render("404", { ...baseViewData(req), title: "404 - Page Not Found" });
});

// 500 error handler (must have 4 params)
app.use((err, req, res, next) => {
  console.error("500 error:", err);
  res.status(500).render("500", {
    ...baseViewData(req),
    title: "500 - Server Error",
    message: "Something went wrong on our end.",
  });
});

// Listen
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});