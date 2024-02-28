import { useEffect, useState } from "react";

const MobileOverlayWrapper = ({ children }: { children: JSX.Element }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const maxWidthForMobile = 960;
    setIsMobile(window.innerWidth <= maxWidthForMobile);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const maxWidthForMobile = 768; // Same as above
      setIsMobile(window.innerWidth <= maxWidthForMobile);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="mobile-block-overlay">
        <div className="message">
          <p className="text-md">
            Our website is best experienced on a desktop device.
          </p>
          <p className="text-md">Please visit us on a desktop browser.</p>
        </div>
        <div className="message">
          <p className="text-md">https://dp-spotify-search.vercel.app/</p>
        </div>
      </div>
    );
  } else {
    return children;
  }
};

export default MobileOverlayWrapper;
