import { useState, useEffect } from "react";
import "./home.scss";
import Navbar from "../../components/navbar/Navbar";
import HeroSlide from "../../components/heroSlide/HeroSlide";
import List from "../../components/list/List";
import Footer from "../../components/containers/Footer";
import axios from "axios";
import SpinnerRoundOutlined from "react-spinners/ClipLoader";
import { useSelector, useDispatch } from "react-redux";
import {getSubStatus} from "../../features/profile/profileSlice";

const Home = ({ type }) => {
  const dispatch = useDispatch();
  const id = JSON.parse(localStorage.getItem("id"));
  const subStatus = useSelector((state) => state.userData.subStatus);

  const [lists, setLists] = useState([]);
  const [loading, setloading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  //
  const getRandomLists = async () => {
    const url = `http://localhost:8800/api/lists`;
    try {
      const res = await axios.get(url, {
        headers: {
          token: "Bearers " + token,
        },
      });
      setLists(res.data);
      setloading(true);
    } catch (error) {
      console.log(error);
    }
  };
  // get subscription status
  useEffect(() => {
      dispatch(getSubStatus(id))
  },[dispatch,subStatus,id])

  useEffect(() => {
    if (token) {
      getRandomLists();
    }
  }, [type]);

  return (
    <div className="home">
      <Navbar />
      {loading ? (
        <>
        <HeroSlide />
        {lists.length !== 0 &&
          lists.map((list, index) => <List list={list} key={index} />)}
        </>
      ) : (
        <p className="ploading text-white text-center">
          <SpinnerRoundOutlined
            size={100}
            thickness={100}
            speed={167}
            color="rgba(255, 255, 255, 0.70)"
          />
        </p>
      )}
     
      <Footer />
    </div>
  );
};

export default Home;
