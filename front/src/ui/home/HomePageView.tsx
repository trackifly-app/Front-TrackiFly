import TrackingSection from "./sections/TrackingSection"
import ShortcutSection from "./sections/ShortcutsSection"
import WhatToShipSection from "./sections/WhatToShipSection"
import LocationsSection from "./sections/LocationsSection"
import CallToActionSection from "./sections/CallToActionSection"
import CalcularEnvioPage from "../ordercalculatorView";

const HomePageView = () => {
  return (
    <div className="bg-white">
      <div className="bg-gray-50 px-50 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <TrackingSection/>
        <CalcularEnvioPage/>
      </div>
      <ShortcutSection/>
      <WhatToShipSection/>
      <LocationsSection/>
      <CallToActionSection/>
    </div>  
  );
};

export default HomePageView;
