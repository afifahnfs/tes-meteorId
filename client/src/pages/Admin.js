import { Container, Table, Button, Image } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

import cssAdmin from "./styleModule/Admin.module.css";
import edit from "../images/edit.png";
import trash from "../images/trash.png";

export default function Admin() {
  const [state, dispatch] = useContext(UserContext);

  let navigate = useNavigate();

  function handleAdd() {
    navigate("/add-route");
  }
  function handleEdit(id) {
    navigate("/edit-route/" + id);
  }
  const [route, setRoute] = useState([]);

  const getRoutes = async () => {
    try {
      const response = await API.get("/routes");

      setRoute(response.data.data.route);

      console.log(response.data.data.route);
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
    getRoutes();
  });

  return (
    <div className={cssAdmin.bg}>
      <Container className="d-flex justify-content-center align-content-center">
        <div>
          <h1 className={cssAdmin.title}>Admin</h1>

          <Table striped bordered hover className={cssAdmin.table}>
            <thead>
              <tr>
                <th>No</th>
                <th>Method</th>
                <th>Path</th>
                <th>Action</th>
              </tr>
            </thead>
            {route.length !== 0 ? (
              <tbody>
                {route?.map((element, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{element.method}</td>
                    <td>{element.path}</td>
                    <td>
                      <button
                        className={cssAdmin.btn}
                        onClick={() => {
                          handleEdit(element.id);
                        }}
                      >
                        <Image className={cssAdmin.img} src={edit} />
                      </button>
                      <button className={cssAdmin.btn}>
                        <Image className={cssAdmin.img} src={trash} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <h1>Data empty</h1>
            )}
          </Table>

          <div>
            <Button
              className={cssAdmin.btnAdd}
              variant="primary"
              onClick={handleAdd}
            >
              Add Route
            </Button>
            <Button variant="danger" onClick={logout}>
              {" "}
              Logout
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
