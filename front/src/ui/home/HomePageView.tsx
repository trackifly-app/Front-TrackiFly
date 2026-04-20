import TrackingSection from './sections/TrackingSection';
import ShortcutSection from './sections/ShortcutsSection';
import WhatToShipSection from './sections/WhatToShipSection';
import LocationsSection from './sections/LocationsSection';
import CallToActionSection from './sections/CallToActionSection';
import CalcularEnvioPage from '../ordercalculatorView';

const HomePageView = () => {
  return (
    <div className="bg-background w-full overflow-x-hidden">
      <div className="bg-surface w-full px-4 sm:px-6 md:px-10 lg:px-20 xl:px-32 py-12 md:py-16 lg:py-20 mt-6 md:mt-10 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-1 items-start">
        <div className="w-full">
          <TrackingSection />
        </div>

        <div className="w-full">
          <CalcularEnvioPage />
        </div>
      </div>

      <div className="space-y-12 md:space-y-16">
        <ShortcutSection />
        <WhatToShipSection />
        <LocationsSection />
        <CallToActionSection />
      </div>
    </div>
  );
};

export default HomePageView;
