export default function Loading() {
  return (
    <div className="container py-20">
      <div className="h-10 w-52 animate-pulse rounded-md bg-muted" />
      <div className="mt-4 h-5 w-96 max-w-full animate-pulse rounded-md bg-muted" />
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
