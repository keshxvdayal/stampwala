import Link from "next/link";
export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-6 text-center">
      <div><div className="font-display text-[120px] font-bold leading-none text-saffron">404</div><h1 className="h-md mt-2">This stamp card page doesn&apos;t exist.</h1><p className="mt-2 text-ink-2">The link may be old or mistyped.</p><Link href="/" className="btn btn-dark mt-8">Back home</Link></div>
    </div>
  );
}
