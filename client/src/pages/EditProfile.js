import {
  Container,
  Form,
  Card,
  Button,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API } from "../config/api";

import cssEditProfile from "./styleModule/EditProfile.module.css";
import noPhoto from "../images/user.jpg";

export default function EditProfile() {
  let navigate = useNavigate();

  const [preview, setPreview] = useState(null); //For image preview
  const [profile, setProfile] = useState({}); //Profile data

  // Create Variabel for profile product data here ...
  const [form, setForm] = useState({
    image: "",
    gender: "",
    phone: "",
    address: "",
  }); //profile data

  // Create function get product data by id from database here ...
  const getProfile = async () => {
    try {
      const response = await API.get("/profile");
      // Store product data to useState variabel
      setPreview(response.data.data.user.image);
      setForm({
        ...form,
        gender: response.data.data.user.gender,
        phone: response.data.data.user.phone,
        address: response.data.data.user.address,
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

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
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
      const response = await API.patch(`/profile`, formData, config);

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
          <h1>Edit Profile</h1>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              className="input"
              name="gender"
              onChange={handleChange}
              value={form.gender}
            >
              <option value="DEFAULT" disabled>
                Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="input"
              name="phone"
              placeholder="Phone"
              onChange={handleChange}
              value={form.phone}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="input"
              placeholder="Address"
              name="address"
              onChange={handleChange}
              value={form.address}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Image</Form.Label>
            <Form.Control type="file" name="image" onChange={handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </form>

        {preview && (
          <div>
            <img
              src={preview}
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                objectFit: "cover",
                marginLeft: "100px",
                marginTop: "100px",
              }}
              alt="preview"
            />
          </div>
        )}
      </Container>
    </div>
  );
}
