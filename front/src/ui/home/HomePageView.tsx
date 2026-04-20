import TrackingSection from "./sections/TrackingSection";
import ShortcutSection from "./sections/ShortcutsSection";
import WhatToShipSection from "./sections/WhatToShipSection";
import LocationsSection from "./sections/LocationsSection";
import CallToActionSection from "./sections/CallToActionSection";
import CalcularEnvioPage from "../ordercalculatorView";
import Chatbot from "@/components/Chatbot";

const HomePageView = () => {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 px-50 py-16 grid grid-cols-1">
        <TrackingSection />
        <CalcularEnvioPage />
      </div>

      <ShortcutSection />
      <WhatToShipSection />
      <LocationsSection />
      <CallToActionSection />

      <Chatbot />
    </div>
  );
};

export default HomePageView;