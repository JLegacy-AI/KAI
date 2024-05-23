import About from "./About";
import FAQ from "./FAQ";
import Features from "./Features";
import Footer from "./Footer";
import Hero from "./Hero";
import Navbar from "./Navbar";
import Pricing from "./Pricing";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <About />
      <Pricing />
      <FAQ />
      <Footer />
    </>
  );
}
