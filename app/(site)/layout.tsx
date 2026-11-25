import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Spotlight } from "@/components/site/Spotlight";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-dark">
      <Spotlight />
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
