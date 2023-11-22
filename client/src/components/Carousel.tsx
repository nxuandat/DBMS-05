import React, { useState, useEffect } from "react";
import { Box } from "@mui/system";

interface RotatingBannerProps {
  bannerImages: string[];
}

const RotatingBanner: React.FC<RotatingBannerProps> = ({ bannerImages }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % bannerImages.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [bannerImages.length]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: '100vh',
      }}
    >
      <img
        src={bannerImages[currentImageIndex]}
        alt={`Banner ${currentImageIndex + 1}`}
        style={{
          width: "70%",
          height: "auto",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />
    </Box>
  );
};

export default RotatingBanner;
