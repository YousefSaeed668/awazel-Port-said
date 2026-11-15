import "./loading.css";

export default function Loading() {
  return (
    <div
      data-site-loading
      className="relative isolate grid min-h-svh place-items-center overflow-hidden bg-background px-6 py-16 text-center text-brand-navy"
    >
      <div
        className="site-loading-pattern pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-sm">
        <div
          className="relative mx-auto mb-12 h-36 w-48"
          aria-hidden="true"
        >
          <span className="site-loading-layer site-loading-layer-base absolute rounded-2xl border border-brand-navy/15 bg-surface-blue" />
          <span className="site-loading-layer site-loading-layer-middle absolute rounded-2xl border border-brand-blue/25 bg-brand-blue" />
          <span className="site-loading-layer site-loading-layer-top absolute rounded-2xl border border-brand-navy bg-brand-navy">
            <span className="absolute inset-3 rounded-lg border border-brand-gold/60" />
          </span>
        </div>

        <p className="mb-4 flex items-center justify-center gap-3 text-sm font-medium text-muted-foreground">
          <span className="h-px w-8 bg-brand-gold" aria-hidden="true" />
          عوازل بورسعيد
          <span className="h-px w-8 bg-brand-gold" aria-hidden="true" />
        </p>

        <div role="status" aria-live="polite" aria-atomic="true">
          <h1 className="text-2xl font-semibold leading-relaxed sm:text-3xl">
            جارٍ تجهيز الصفحة
          </h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            لحظات وتظهر لك التفاصيل.
          </p>
        </div>

        <div
          className="relative mx-auto mt-8 h-1 w-40 overflow-hidden rounded-full bg-border/70"
          aria-hidden="true"
        >
          <span className="site-loading-progress absolute inset-y-0 start-0 w-1/2 rounded-full bg-brand-gold" />
        </div>
      </div>
    </div>
  );
}
