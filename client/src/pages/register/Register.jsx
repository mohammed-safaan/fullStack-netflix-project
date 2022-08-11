import React from "react";
import Header from "../../components/Header/index";
import Jumbotron from "../../components/Jumbotron";
import jumboData from "../../fixtures/jumbo.json";
import Footer from "../../components/containers/Footer";
import { FaqsContainer } from "../../components/containers/faqs";
import "./register.scss";

function Register() {
  return (
    <>
      <Header />
      <Jumbotron.Container>
        {jumboData.map((item, indx) => {
          return (
            <Jumbotron key={indx} direction={item.direction}>
              <Jumbotron.Pane>
                <Jumbotron.Title>{item.title}</Jumbotron.Title>
                <Jumbotron.SubTitle>{item.subTitle}</Jumbotron.SubTitle>
              </Jumbotron.Pane>
              <Jumbotron.Pane className="pane">
                <Jumbotron.Image src={item.image}></Jumbotron.Image>
                <video
                  className="ourVideo"
                  src={item.video}
                  autoPlay
                  muted
                  loop
                ></video>
              </Jumbotron.Pane>
            </Jumbotron>
          );
        })}
      </Jumbotron.Container>
      <FaqsContainer />
      <Footer />
    </>
  );
}

export default Register;
