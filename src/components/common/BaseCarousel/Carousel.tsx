// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export const BaseCarousel = React.forwardRef<Slider, Settings>(
  ({ slidesToShow = 1, arrows = false, dots = false, centerMode = false, children, ...props }, ref) => {
    const carouselRef = useRef();
    const totalRef = ref || carouselRef;
    const [isStart, setIsStart] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const handleBeforeChange = (oldIndex: number, newIndex: number) => {
      const slideCount = React.Children.count(children);
      setIsStart(newIndex === 0);
      setIsEnd(newIndex + slidesToShow >= slideCount);
    };

    const handleScroll = useCallback(
      (event) => {
        const x = event.deltaX;
        const y = event.deltaY;

        if (x > 20 && -5 < y && y < 5 && !isEnd) {
          return totalRef?.current?.slickNext();
        }

        if (x < -20 && -5 < y && y < 5 && !isStart) {
          return totalRef?.current?.slickPrev();
        }
      },
      [totalRef, isStart, isEnd],
    );

    const handleMouseOn = useCallback(() => {
      document.body.style.overscrollBehaviorX = 'none';
    }, []);

    const handleMouseOff = useCallback(() => {
      document.body.style.overscrollBehaviorX = 'unset';
    }, []);

    useEffect(() => {
      if (totalRef.current) {
        const slickList = totalRef.current?.innerSlider?.list;

        slickList.addEventListener('wheel', handleScroll);
        slickList.addEventListener('mouseover', handleMouseOn);
        slickList.addEventListener('mouseout', handleMouseOff);

        return () => {
          slickList.removeEventListener('wheel', handleScroll);
          slickList.removeEventListener('mouseover', handleMouseOn);
          slickList.removeEventListener('mouseout', handleMouseOff);
        };
      }
    }, [totalRef, handleScroll, handleMouseOn, handleMouseOff]);

    const settings = {
      slidesToShow,
      arrows,
      dots,
      infinite: false,
      centerMode: false,
      beforeChange: handleBeforeChange,
      ...props,
    };

    return (
      <Slider ref={totalRef} {...settings}>
        {children}
      </Slider>
    );
  },
);
