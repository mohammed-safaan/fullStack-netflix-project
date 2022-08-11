import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { Container, Card, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Plans.scss";
const Plans = () => {
  const id = JSON.parse(localStorage.getItem("id"));
  return (
    <>
      <Container fluid className="bg-light text-dark plans-container pt-5">
        <Form
          action="/api/subscription/create-checkout-session"
          method="POST"
          className="container"
        >
          {/* Add a hidden field with the lookup_key of your Price */}
          <Row>
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
            <input
              type="hidden"
              id="userId"
              name="userId"
              value={id}
            />
            <input
              type="hidden"
              id="userId"
              name="lookup_key"
              value="Netflix subscription"
            />
          </Row>
          <button
            id="checkout-and-portal-button"
            className="updateBtn btn m-2 mt-3"
            type="submit"
          >
            Subscripe
          </button>
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
          <Card className="w-75">
            <Card.Title>
              {/* <h3>Subscription to starter plan successful!</h3> */}
              <h3 className="m-0 p-3">Subscription successful!</h3>
            </Card.Title>
            <Card.Body>
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
                  className="btn btn-dark my-3 me-2"
                >
                  Manage your billing information
                </button>
                <button
                  id=""
                  type="button"
                  className="btn updateBtn"
                  onClick={() => navigate("/")}
                >
                  Go to the Homepage
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
    <Container fluid className="bg-light text-dark plans-container">
      <Container>
        <Row className="justify-content-center align-items-center p-3">
          <section className="alert alert-dark">
            <p className="display-4">{message}</p>
            <button className="btn btn-dark" onClick={() => navigate("/")}>
              Choose a plan
            </button>
          </section>
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
      setMessage("Order canceled -- you need to subscripe to use our services");
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
