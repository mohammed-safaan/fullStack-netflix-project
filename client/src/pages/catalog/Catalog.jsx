import React from "react";
import { useParams } from "react-router";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/containers/Footer";
import MovieGrid from "../../components/movie-grid/MovieGrid";
import "./catalog.scss";

const Catalog = () => {
  const { type } = useParams();

  return (
    <div className="category">
      <Navbar />
      <h2 className="text-center catehead">{type}</h2>
      <div className="container">
        <div className="section">
          <MovieGrid type={type} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Catalog;
