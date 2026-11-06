import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-start justify-center px-4 py-16">
      <p className="text-sm text-gold">404</p>
      <h1 className="mt-2 font-display text-4xl text-ink">الصفحة غير موجودة</h1>
      <p className="mt-3 text-muted">This page is not on the Al Khadher site.</p>
      <a href="/" className="mt-6 text-sm font-medium text-primary underline-offset-4 hover:underline">
        العودة للرئيسية
      </a>
    </main>
  );
}

export function getRouter() {
  const router = createRouter({
    routeTree,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
  });
  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
