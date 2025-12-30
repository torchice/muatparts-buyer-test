"use client";

import CropperWeb from "./CropperWeb";
import CropperResponsive from "./CropperResponsive";
import { viewport } from "@/store/viewport";

const Cropper = (props) => {
  const { isMobile } = viewport();

  if (isMobile) {
    return <CropperResponsive {...props} />;
  }
  return <CropperWeb {...props} />;
};

export default Cropper;
