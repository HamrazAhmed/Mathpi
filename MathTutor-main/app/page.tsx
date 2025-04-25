import { Hero, MathTutorPage } from "@/components/home";
import Analytics from "@/components/home/analytics";
import TimeSavingsUI from "@/components/home/attract";
import GetStarted from "@/components/home/getStarted";
// import PricingStructure from "@/components/home/pricing-page";
import RadarPreview from "@/components/home/radarPreview";
import Footer from "@/components/home/footer";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

export default function Home() {
  return (
    <div>
      <Hero/>
      <MacbookScroll src="/dashboard.png"/>
      <Analytics/>
      <TimeSavingsUI/>
      <MathTutorPage/>
      <RadarPreview/>
      {/* <PricingStructure/> */}
      <GetStarted/>
      <Footer/>
    </div>
  );
}
