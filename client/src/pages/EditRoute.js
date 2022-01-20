import { Container, Form, Button, Image } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { API } from "../config/api";

import cssEditProfile from "./styleModule/EditProfile.module.css";

export default function EditRoute() {
  let navigate = useNavigate();

  const { id } = useParams();

  // Create Variabel for profile product data here ...
  const [form, setForm] = useState({
    method: "",
    path: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  console.log(form);

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
      formData.set("method", form.method);
      formData.set("path", form.path);

      console.log(formData);

      // Insert product data
      const response = await API.patch("/route/" + id, formData, config);

      console.log(response.data);
      navigate("/admin");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={cssEditProfile.bg}>
      <Container className="d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
          <h1>Edit Route</h1>
          <Form.Group className="mb-3">
            <Form.Label>Method</Form.Label>
            <Form.Control
              type="input"
              name="method"
              placeholder="Method"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Path</Form.Label>
            <Form.Control
              type="input"
              name="path"
              placeholder="Path"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Add
          </Button>
        </form>
      </Container>
    </div>
  );
}
