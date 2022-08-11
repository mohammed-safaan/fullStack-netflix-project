import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import Button, { OutlineButton } from "../button/Button";
import Modal, { ModalContent } from "../modal/Modal";
import { Link } from "react-router-dom";
import "./heroslide.scss";

const HeroSlide = () => {
  SwiperCore.use([Autoplay]);
  const [movieItems, setMovieItems] = useState([]);
  useEffect(() => {
    const getMovies = async () => {
      const url = `http://localhost:8800/api/movies/random`;
      try {
        const res = await axios.get(url, {
          headers: {
            token:
              "Bearers eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyZWU4NGQ5MTQ3MDkwNTdhYzZmZjU0NSIsImlzQWRtaW4iOmZhbHNlLCJpYXQiOjE2NTk3OTg4ODMsImV4cCI6MTY2NDExODg4M30.MtFf9CekArm08BKokr2InDdYfVwOllsemxC28sIlisE",
          },
        });
        setMovieItems(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMovies();
  }, []);

  return (
    <div className="hero-slide">
      <Swiper
        modules={[Autoplay]}
        grabCursor={true}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
      >
        {movieItems &&
          movieItems.map((item, i) => (
            <SwiperSlide key={i}>
              {({ isActive }) => (
                <HeroSlideItem
                  item={item}
                  className={`${isActive ? "active" : ""}`}
                />
              )}
            </SwiperSlide>
          ))}
      </Swiper>
      {movieItems.map((item, i) => (
        <TrailerModal key={i} item={item} />
      ))}
    </div>
  );
};

const HeroSlideItem = (props) => {
  const movie = props.item;
  let moviedesc = movie.desc.slice(0, 300);

  const setModalActive = async () => {
    const modal = document.querySelector(`#mymodal_${movie.id}`);
    const video = movie.trailer;

    if (video) {
      setTimeout(() => {
        const videSrc = `https://www.youtube.com/embed/${video}`;

        modal
          .querySelector(".mymodal__content > iframe")
          .setAttribute("src", videSrc);
      });
    } else {
      modal.querySelector(".mymodal__content").innerHTML = "No trailer";
    }

    modal.classList.toggle("active");
  };

  return (
    <div
      className={`hero-slide__item ${props.className}`}
      style={{ backgroundImage: `url(${movie.imgTitle})` }}
    >
      {
        <div className="hero-slide__item__content container">
          <div className="hero-slide__item__content__info">
            <h2 className="title">{movie.title}</h2>
            <div className="overview">{moviedesc}</div>
            <div className="btns d-sm-flex">
              <Button>
                <Link to="/watch" state={{ movie: movie }}>
                  Watch now
                </Link>
              </Button>
              <OutlineButton onClick={setModalActive}>
                Watch trailer
              </OutlineButton>
            </div>
          </div>
          <div className="hero-slide__item__content__poster">
            <img src={movie.img} alt="" />
          </div>
        </div>
      }
    </div>
  );
};

const TrailerModal = (props) => {
  const item = props.item;

  const iframeRef = useRef(null);

  const onClose = () => iframeRef.current.setAttribute("src", "");

  return (
    <Modal active={false} id={`mymodal_${item.id}`}>
      <ModalContent onClose={onClose}>
        <iframe
          ref={iframeRef}
          width="100%"
          height="500px"
          title="trailer"
        ></iframe>
      </ModalContent>
    </Modal>
  );
};

export default HeroSlide;
