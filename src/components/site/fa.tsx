export function Fa({
  name,
  brand = false,
  className = "",
}: {
  name: string;
  brand?: boolean;
  className?: string;
}) {
  return <i className={`${brand ? "fa-brands" : "fa-solid"} fa-${name} fa-fw ${className}`} aria-hidden="true" />;
}
