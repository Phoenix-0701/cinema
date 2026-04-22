import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Import rất gọn gàng từ folder features/home (tự động ăn vào file index.ts)
import {
  HeroSection,
  NowShowingSection,
  PremiumPromoSection,
} from "../features/home";

export default function HomePage() {
  return (
    <>
      <Header />

      <main className="relative min-h-screen pt-20">
        <HeroSection />

        {/* Component này sẽ tự động gọi API và render phim ở phía Client */}
        <NowShowingSection />

        <PremiumPromoSection />
      </main>

      <Footer />
    </>
  );
}
