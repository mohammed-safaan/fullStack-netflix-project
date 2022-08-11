import React from "react";
import { Col, Container, Row, Card } from "react-bootstrap";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./dashboard.scss";
const Dashboard = () => {
  return (
    <div className="m-0 p-0 w-100 pt-5 bg-dark">
      <Navbar />
      <Container fluid className="dash-container bg-dark text-light">
        <Row className="h-100 position-relative">
          <Col sm={12} md={4} lg={3} className="h-100 px-0 pb-3 side-container">
            <Card className=" w-100 py-3 side-dash ">
              <Card.Body className="d-flex flex-column p-0">
                <NavLink
                  to="/dashboard/users"
                  className={({ isActive }) =>
                    isActive
                      ? "link d-flex align-items-center p-3 active"
                      : "link d-flex align-items-center p-3"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Users
                </NavLink>
                <NavLink
                  to="/dashboard/movies"
                  className={({ isActive }) =>
                    isActive
                      ? "link d-flex align-items-center p-3 active"
                      : "link d-flex align-items-center p-3"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
                    />
                  </svg>
                  Movies
                </NavLink>
                <NavLink
                  to="/dashboard/addmovie"
                  className={({ isActive }) =>
                    isActive
                      ? "link d-flex align-items-center p-3 active"
                      : "link d-flex align-items-center p-3"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Add Movie
                </NavLink>
              </Card.Body>
            </Card>
          </Col>
          <Col sm={12} md={8} lg={9} className="h-100 py-3">
            <Row>
              <Outlet />
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
