import { Container, Card, Button, Row, Col, Image } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

import cssProfile from "./styleModule/Profile.module.css";
import noPhoto from "../images/user.jpg";

export default function Profile() {
  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  function handleEdit() {
    navigate("/edit-profile");
  }
  function handleChange() {
    navigate("/change-password");
  }
  const [profile, setProfile] = useState({});

  // Fetching profile data from database
  const getProfile = async () => {
    console.log("test profile");
    try {
      const response = await API.get("/profile");
      // Store product data to useState variabel
      setProfile(response.data.data.user);

      console.log(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = () => {
    console.log(state);
    dispatch({
      type: "LOGOUT",
    });
    navigate("/");
  };
  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className={cssProfile.bg}>
      <Container className="d-flex justify-content-center">
        <Card className={cssProfile.card}>
          <Card.Header as="h5">My Profile</Card.Header>
          <div className="d-flex">
            <Card.Img
              className={cssProfile.image}
              src={
                profile.image === "http://localhost:5000/uploads/null"
                  ? noPhoto
                  : profile.image
              }
            />
            <Card.Body className={cssProfile.cardBody}>
              <Card.Text>
                <h6>Nama: {profile.fullName}</h6>
                <h6>Email: {profile.email}</h6>
                <h6>Gender: {profile.gender}</h6>
                <h6>No Tlp: {profile.phone}</h6>
                <h6>address: {profile.address}</h6>
              </Card.Text>
              <Button
                variant="primary"
                onClick={handleEdit}
                className={cssProfile.btn}
              >
                Edit Profile
              </Button>
              <Button
                variant="success"
                className={cssProfile.btn}
                onClick={handleChange}
              >
                Change Password
              </Button>
              <Button variant="danger" onClick={logout}>
                Logout
              </Button>
            </Card.Body>
          </div>
        </Card>
      </Container>
    </div>
  );
}
