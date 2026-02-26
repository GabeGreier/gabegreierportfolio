export default function Loading() {
  return (
    <div className="container py-20">
      <div className="brand-loading h-10 w-56" />
      <div className="brand-loading mt-4 h-5 w-96 max-w-full" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="brand-loading h-72 border border-border/70" />
        ))}
      </div>
    </div>
  );
}
