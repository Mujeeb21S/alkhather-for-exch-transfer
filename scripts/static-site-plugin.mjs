import { createReadStream, existsSync, statSync } from "node:fs";
import { join, normalize, extname } from "node:path";

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".md": "text/markdown; charset=utf-8",
};

/** Serve /workspace/site on the preview so the static GitHub Pages build is what visitors see. */
export function staticSitePlugin(root) {
  return {
    name: "alkhadher-static-site",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if ((req.method ?? "GET").toUpperCase() !== "GET" && (req.method ?? "GET").toUpperCase() !== "HEAD") {
          next();
          return;
        }
        const raw = decodeURIComponent((req.url ?? "/").split("?")[0] ?? "/");
        let pathname = raw === "/" ? "/index.html" : raw;
        if (pathname.includes("..")) {
          next();
          return;
        }
        const file = normalize(join(root, pathname));
        if (!file.startsWith(normalize(root)) || !existsSync(file) || !statSync(file).isFile()) {
          next();
          return;
        }
        res.statusCode = 200;
        res.setHeader("content-type", TYPES[extname(file)] || "application/octet-stream");
        res.setHeader("cache-control", "no-cache");
        if ((req.method ?? "GET").toUpperCase() === "HEAD") {
          res.end();
          return;
        }
        createReadStream(file).pipe(res);
      });
    },
  };
}
