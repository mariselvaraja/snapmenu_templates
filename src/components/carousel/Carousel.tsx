import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './carousel.css';

export interface CarouselItem {
  id: string | number;
  content: React.ReactNode;
}

export interface CarouselProps {
  items: CarouselItem[];
  autoplay?: boolean;
  autoplaySpeed?: number;
  dots?: boolean;
  arrows?: boolean;
  infinite?: boolean;
  speed?: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  responsive?: Array<{
    breakpoint: number;
    settings: {
      slidesToShow: number;
      slidesToScroll: number;
    };
  }>;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({
  items,
  autoplay = true,
  autoplaySpeed = 3000,
  dots = true,
  arrows = true,
  infinite = true,
  speed = 500,
  slidesToShow = 1,
  slidesToScroll = 1,
  responsive = [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      }
    }
  ],
  className = ''
}) => {
  const settings = {
    dots,
    infinite,
    speed,
    slidesToShow,
    slidesToScroll,
    autoplay,
    autoplaySpeed,
    arrows,
    responsive
  };

  return (
    <div className={`carousel-container ${className}`}>
      <Slider {...settings}>
        {items.map((item) => (
          <div key={item.id} className="carousel-slide">
            {item.content}
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
