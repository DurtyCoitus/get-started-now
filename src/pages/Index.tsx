import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Demo } from "@/components/landing/Demo";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Demo />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
