import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Row, Col, Image } from "react-bootstrap";
import {arrowRight} from "../constants/PatientImages";
import React from "react";

const CarouselComponent = ({sliders}) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const CustomeRightArrow = ({ onClick, ...rest }) => {
    return (
      <button
        className="react-multiple-carousel__arrow react-multiple-carousel__arrow---right"
        onClick={() => onClick()}
      >
        <Image src={arrowRight} />
      </button>
    );
  };

  return (
    <>
      <Row>
        <Col lg="12">
          <Carousel
            autoPlay={true}
            customLeftArrow={<></>}
            customRightArrow={<CustomeRightArrow />}
            swipeable={false}
            draggable={false}
            showDots={true}
            responsive={responsive}
            ssr={true}
            infinite={true}
            autoPlaySpeed={3000}
            keyBoardControl={true}
            customTransition="all .5"
            transitionDuration={500}
            containerClass="carousel-container"
            removeArrowOnDeviceType={["tablet", "mobile"]}
            dotListClass="custom-dot-list-style"
            itemClass="carousel-item-padding-40-px"
            className="carousel_container"
          >

            {sliders.map((slider) => {
              return(
                <div className="carousel_container">
                <Row
                  className='g-0'
                  style={{
                    background:
                      "linear-gradient(92.07deg, #28A3DA 0.26%, #3085AB 99.17%)",
                  }}
                >
                  <Col lg="3">
                    <Image
                      src={slider.image}
                      alt="carousel_image_1"
                      className="carousel_image"
                      style={{ marginLeft: "80px",  width: "100%" }}
                    />
                  </Col>
                  <Col lg="9">
                    <Row>
                      <span
                        className="carousel_h3"
                        style={{
                          marginBottom: "50px",
                          marginTop: "40px",
                          paddingLeft: "130px",
                        }}
                      >
                        {slider.title}
                      </span>
                    </Row>
                    <Row>
                      <span
                        className="carousel_h5"
                        style={{ paddingLeft: "130px" }}
                      >
                        {slider.desc}
                      </span>
                    </Row>
                  </Col>
                </Row>
              </div>
              )
            })}
          </Carousel>
        </Col>
      </Row>
    </>
  );
};

export default CarouselComponent;
