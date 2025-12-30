import React, { useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageComponent from "../ImageComponent/ImageComponent";

const CustomArrow = ({ direction, ...props }) => {
  const { className, onClick } = props;
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;

  return (
    <div
      className={`custom-arrow ${className}`}
      onClick={onClick}
    >
      <Icon />
    </div>
  );
};

const CustomSlide = ({ index, image, url, size, className = "" }) => (
  <a href={url ? url : null} target="_blank" rel="noopener noreferrer">
    <ImageComponent
      src={image}
      alt={`slide-${index}`}
      width={size}
      height={size}
      className={className}
    />
  </a>
);

const CustomDots = ({ dots, goToSlide, currentSlide }) => (
  <div className="custom-dots">
    {dots?.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={`h-2 rounded-full transition-all duration-300 ${
          currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/60"
        }`}
      />
    ))}
  </div>
);

/**
 * A React component that renders a multiple items slider using react-slick.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.settings - The settings for the react-slick slider.
 * @param {Array<string>} props.images - An array of image URLs to be displayed in the slider.
 * @param {Array<string>} [props.urls] - An optional array of URLs corresponding to each image.
 * @param {string} props.size - The size of the images in the slider.
 * @param {string} [props.arrowPadding="0px"] - The padding around the slider arrows.
 * @param {string} props.className - Additional class names for custom styling.
 *
 * @returns {JSX.Element} The rendered multiple items slider component.
 */
const MultipleItems = ({
  settings,
  images,
  urls,
  size,
  arrowPadding = "0px",
  className,
  withArrow=true
}) => {
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const customSettings = {
    ...settings,
    nextArrow: withArrow?<CustomArrow direction="next" />:'',
    prevArrow: withArrow?<CustomArrow direction="prev" />:'',
    appendDots: (dots) => (
      <CustomDots
        dots={dots}
        goToSlide={(index) => sliderRef.current.slickGoTo(index)}
        currentSlide={currentSlide}
      />
    ),
    beforeChange: (_, next) => setCurrentSlide(next),
    afterChange: (current) => setCurrentSlide(current),
    adaptiveHeight: true,
  };
  return (
    <>
      <style jsx global>{`
        .custom-arrow::before {
          content: none !important;
        }

        .custom-arrow.slick-prev,
        .custom-arrow.slick-next {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          box-shadow: 0 4px 11px 0 #41414140;
          border-radius: 50%;
          color: #000;
          width: 44px;
          height: 44px;
          z-index: 1;
          background: white;
          opacity: 0;
          transition: all 0.3s ease-in-out;
          position: absolute;
        }

        .custom-arrow.slick-prev {
          left: -40px;
        }

        .custom-arrow.slick-next {
          right: -40px;
        }

        /* Saat container di hover */
        .slick-slider:hover .custom-arrow.slick-prev {
          opacity: 1;
          left: -20px;
        }

        .slick-slider:hover .custom-arrow.slick-next {
          opacity: 1;
          right: -20px;
        }

        .slider-container {
          position: relative;
        }

        .custom-dots {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          justify-content: center;
          gap: 8px;
        }
      `}</style>
      <div className="slider-container">
        <Slider
          {...customSettings}
          ref={sliderRef}
          style={{ padding: `0 ${arrowPadding}` }}
        >
          {images?.map((image, index) => (
            <CustomSlide
              key={index}
              index={index}
              image={image}
              url={urls?.[index]}
              size={size}
              className={className}
            />
          ))}
        </Slider>
      </div>
    </>
  );
};

export default MultipleItems;
