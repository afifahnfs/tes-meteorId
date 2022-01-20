import { Container, Form, Button, Image } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API } from "../config/api";

import cssEditProfile from "./styleModule/EditProfile.module.css";

export default function ChangePassword() {
  let navigate = useNavigate();

  const [profile, setProfile] = useState({}); //Profile data

  // Create Variabel for profile product data here ...
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  }); //profile data

  // Create function get product data by id from database here ...
  const getProfile = async () => {
    try {
      const response = await API.get("/profile");
      setForm({
        ...form,
        fullName: response.data.data.user.fullName,
        email: response.data.data.user.email,
        password: response.data.data.user.password,
      });
      setProfile(response.data.data.user);

      console.log(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // Create function for handle change data on form here ...
  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });
  };

  // Create function for handle submit data ...
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);

      // Insert product data
      const response = await API.patch(`/password`, formData, config);

      console.log(response.data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [profile]);

  return (
    <div className={cssEditProfile.bg}>
      <Container className="d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
          <h1>Change Password</h1>

          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="input"
              name="fullName"
              onChange={handleChange}
              value={form.fullName}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={handleChange}
              value={form.password}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Edit
          </Button>
        </form>
      </Container>
    </div>
  );
}
