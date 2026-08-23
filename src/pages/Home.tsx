import { Hero } from '../components/Hero';
import { ServiceCategories } from '../components/ServiceCategories';
import { PopularServices } from '../components/PopularServices';
import { TechnicianShowcase } from '../components/TechnicianShowcase';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { HowItWorks } from '../components/HowItWorks';
import { Testimonials } from '../components/Testimonials';
import { Statistics } from '../components/Statistics';
import { AIAssistantPreview } from '../components/AIAssistantPreview';
import { FAQ } from '../components/FAQ';
import { SEO } from '../components/SEO';

export function Home() {
  return (
    <main>
      <SEO 
        title="Professional Electrical Services" 
        description="Book top-rated, certified electricians for all your home and commercial repair needs." 
        keywords="electrician, home service, fan repair, wiring, professional electrician" 
      />
      <Hero />
      <ServiceCategories />
      <PopularServices />
      <div id="technicians">
        <TechnicianShowcase />
      </div>
      <WhyChooseUs />
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <Testimonials />
      <Statistics />
      <AIAssistantPreview />
      <FAQ />
    </main>
  );
}
