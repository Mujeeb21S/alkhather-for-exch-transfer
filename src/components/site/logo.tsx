export function Logo({ className = "h-14 w-auto sm:h-16" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt=""
      width={720}
      height={654}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
