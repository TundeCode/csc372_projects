

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// Decide content-type based on extension
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".html": return "text/html; charset=utf-8";
    case ".css":  return "text/css; charset=utf-8";
    case ".js":   return "application/javascript; charset=utf-8";
    case ".png":  return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".gif":  return "image/gif";
    case ".svg":  return "image/svg+xml";
    case ".ico":  return "image/x-icon";
    default:      return "application/octet-stream";
  }
}

// Required by assignment: serveStaticFile()
// - 200 success
// - 500 server error
// - correct Content-Type
function serveStaticFile(res, filePath, statusCode = 200) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("500 - Server Error");
      return;
    }
    res.writeHead(statusCode, { "Content-Type": getContentType(filePath) });
    res.end(data);
  });
}

// Normalize URL: remove query, trailing slash, lowercase
function normalizeUrl(reqUrl) {
  const noQuery = reqUrl.split("?")[0];
  const trimmed = noQuery.endsWith("/") && noQuery !== "/" ? noQuery.slice(0, -1) : noQuery;
  return trimmed.toLowerCase();
}

const server = http.createServer((req, res) => {
  const urlPath = normalizeUrl(req.url);

  // Map pretty routes to actual html files in /public
  // (You can add more routes here if you make more pages)
  const routes = {
    "/": "/home.html",
    "/home": "/home.html",
    "/shop": "/shop.html",
    "/faqs": "/faqs.html",
    "/hotline": "/hotline.html",
    "/cart": "/cart.html"
  };

  // 1) If it's a known route, serve that HTML file
  if (routes[urlPath]) {
    const filePath = path.join(PUBLIC_DIR, routes[urlPath]);
    return fs.existsSync(filePath)
      ? serveStaticFile(res, filePath, 200)
      : serveStaticFile(res, path.join(PUBLIC_DIR, "404.html"), 404);
  }

  // 2) Otherwise, try serving it as a static file (css/js/images/etc.)
  // Example: /css/styles.css, /js/lookbook.js, /images/foo.png
  const staticPath = path.join(PUBLIC_DIR, urlPath);

  // prevent path traversal
  if (!staticPath.startsWith(PUBLIC_DIR)) {
    return serveStaticFile(res, path.join(PUBLIC_DIR, "404.html"), 404);
  }

  fs.stat(staticPath, (err, stat) => {
    if (!err && stat.isFile()) {
      return serveStaticFile(res, staticPath, 200);
    }

    // 3) Not found -> serve custom 404 page
    return serveStaticFile(res, path.join(PUBLIC_DIR, "404.html"), 404);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});