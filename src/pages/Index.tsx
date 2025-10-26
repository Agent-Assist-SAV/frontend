import { Hero } from "@/components/Hero";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { HowItWorks } from "@/components/HowItWorks";
import { IntegrationsRow } from "@/components/IntegrationsRow";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturesGrid />
      <HowItWorks />
      <IntegrationsRow />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
