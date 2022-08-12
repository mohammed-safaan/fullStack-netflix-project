import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Container, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Plans.scss";
import payment from "../../assets/payment.gif";
import pay from "../../assets/pay.png";

const Plans = () => {
  const id = JSON.parse(localStorage.getItem("id"));
  const navigate = useNavigate();
  return (
    <>
      <Container fluid className="bg-light text-dark plans-container pt-5">
        <Form
          action="/api/subscription/create-checkout-session"
          method="POST"
          className="container w-100 h-100"
        >
          {/* Add a hidden field with the lookup_key of your Price */}
          <Row className="justify-content-center align-items-center w-100 h-100">
            <>
              {/* <Col sm={6}>
              <Card className="plan-card position-relative" border="danger">
                <label htmlFor="Basic plan" className="label">
                  <Card.Title className="p-3 my-2">Basic plan 5$/mo</Card.Title>
                  <Card.Body>
                    70 Hours of watch time without ads , 7 days free Then $5.00
                    per month
                    <ListGroup>
                      <ListGroup.Item>Cras justo odio</ListGroup.Item>
                      <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                      <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                      <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                      <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </label>
                <Form.Check
                  defaultChecked
                  id="Basic plan"
                  type="radio"
                  name="lookup_key"
                  value="Basic plan"
                  className="position-absolute top-0 end-0 m-2"
                />
              </Card>
            </Col>
            <Col sm={6}>
              <Card className="plan-card position-relative" border="danger">
                <label htmlFor="Premium plan" className="label">
                  <Card.Title className="p-3 my-2">
                    Premium plan 10$/mo
                  </Card.Title>
                  <Card.Body>
                    Unlimted Hours of watch time without ads, 7 days free Then
                    $5.00 per month
                    <ListGroup>
                      <ListGroup.Item>Cras justo odio</ListGroup.Item>
                      <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
                      <ListGroup.Item>Morbi leo risus</ListGroup.Item>
                      <ListGroup.Item>Porta ac consectetur ac</ListGroup.Item>
                      <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
                    </ListGroup>
                  </Card.Body>
                </label>
                <Form.Check
                  id="Premium plan"
                  type="radio"
                  name="lookup_key"
                  value="Premium plan"
                  className="position-absolute top-0 end-0 m-2"
                />
              </Card>
            </Col> */}
            </>
            <Col md={6} lg={4}>
              <Card bg="dark" className="text-light">
                <Card.Title className="m-3">
                  Subscripe to watch movies
                <img src={pay} className="img-fluid" alt="pay"/>
                  {/* Subscripe to be able to watch the movies */}
                </Card.Title>
                <Card.Body>
                  <input type="hidden" id="userId" name="userId" value={id} />
                  <input
                    type="hidden"
                    id="userId"
                    name="lookup_key"
                    value="Netflix subscription"
                  />
                  <button
                    id="checkout-and-portal-button"
                    className="updateBtn btn m-2 "
                    type="submit"
                  >
                    Subscripe
                  </button>
                  <button type="button" className="btn btn-light m-2"
                    onClick={()=> navigate("/home")}
                  > 
                    Back Home
                  </button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
};

const SuccessDisplay = ({ sessionId }) => {
  const navigate = useNavigate();
  return (
    <Container fluid className="bg-light text-dark plans-container">
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <Card className="w-75 bg-dark text-light">
            <Card.Header>
              {/* <h3>Subscription to starter plan successful!</h3> */}
              <h3 className="m-0 px-4 py-2">Subscription successful!</h3>
            </Card.Header>
            <Card.Body className="d-flex flex-column">
              <img src={payment} className="img-fluid mx-auto" alt="payment"/>
              <form
                action="/api/subscription/create-portal-session"
                method="POST"
              >
                <input
                  type="hidden"
                  id="session-id"
                  name="session_id"
                  value={sessionId}
                />
                <button
                  id="checkout-and-portal-button"
                  type="submit"
                  className="btn btn-light my-3 me-2"
                >
                  Billing settings
                </button>
                <button
                  id=""
                  type="button"
                  className="btn updateBtn"
                  onClick={() => navigate("/")}
                >
                  Homepage
                </button>
              </form>
            </Card.Body>
          </Card>
        </Row>
      </Container>
    </Container>
  );
};

const Message = ({ message }) => {
  const navigate = useNavigate();
  return (
    <Container fluid className=" plans-container">
      <Container className="h-100">
        <Row className="justify-content-center align-items-center p-3 h-100">
          <Col md={6} lg={4}>
          <Card className="bg-dark text-light">
            <Card.Title className="h3 p-3">{message}</Card.Title>
            <Card.Body>
            <button className="btn btn-light" onClick={() => navigate("/")}>
              Back to Home
            </button>
            </Card.Body>
          </Card>
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default function Planspage() {
  let [message, setMessage] = useState("");
  let [success, setSuccess] = useState(false);
  let [sessionId, setSessionId] = useState("");

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setSuccess(true);
      setSessionId(query.get("session_id"));
    }

    if (query.get("canceled")) {
      setSuccess(false);
      setMessage("Subscription canceled -- you need to subscripe to watch movies");
    }
  }, [sessionId]);

  if (!success && message === "") {
    return <Plans />;
  } else if (success && sessionId !== "") {
    return <SuccessDisplay sessionId={sessionId} />;
  } else {
    return <Message message={message} />;
  }
}
