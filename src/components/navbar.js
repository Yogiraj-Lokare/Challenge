import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { Navbar, Nav, Form, FormControl, Modal, Card } from "react-bootstrap";
import PropTypes from "prop-types";
import { useState } from "react";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Badge, Button } from "@material-ui/core";
import { indexdbSetup } from "../utils/indexdb";

function NavBar(props) {
  const [option, setOption] = useState("title");
  const [show, setShow] = useState(false);
  const [data, setdata] = useState([]);
  const [cartCounter, setCounter] = useState(0);
  const [totalcost, setCost] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const getAllindexDbData = () => {
    var request = window.indexedDB.open("CartDatabase", 2);
    request.onsuccess = (e) => {
      var returnData = [];
      var db = e.target.result;
      var trans = db.transaction(["cart"], "readwrite");
      var store = trans.objectStore("cart");
      var cursorRequest = store.openCursor();
      cursorRequest.onsuccess = (e) => {
        var result = e.target.result;
        if (!!result == false) {
          setdata(returnData);
          setCounter(returnData.length);
          return;
        }
        returnData.push(result.value);
        result.continue();
      };
    };
  };
  const removeItem = (par) => {
    var request = window.indexedDB.open("CartDatabase", 2);
    request.onsuccess = (e) => {
      var db = e.target.result;
      var trans = db.transaction(["cart"], "readwrite");
      var store = trans.objectStore("cart");
      store.delete(par.bookID);
      getAllindexDbData();
    };
  };

  useEffect(() => {
    indexdbSetup();
    var totalCost = 0;
    data.map((book) => {
      totalCost += book.price * book.quantity;
    });
    setCost(totalCost);
    getAllindexDbData();
  }, [data]);
  return (
    <React.Fragment>
      <Navbar
        className=" bg-dark"
        style={{ borderBottom: "1px solid white" }}
        variant="dark"
        expand="lg"
      >
        <Navbar.Brand href="#home">Book Repository</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">About</Nav.Link>
          </Nav>
          <Button
            onClick={handleShow}
            className="mr-3"
            style={{ outline: "none" }}
          >
            <Badge badgeContent={cartCounter} color="secondary">
              <ShoppingCartIcon style={{ color: "white" }} />
            </Badge>
          </Button>
          <Form inline className="d-flex">
            <div>
              <FormControl
                type="text"
                style={{ backgroundColor: "#222", color: "white" }}
                onChange={(e) => props.setsearch(e.target.value, option)}
                placeholder="Search books.."
                className="w-100"
              />
            </div>
            <div>
              <select
                style={{ backgroundColor: "#222", color: "white" }}
                className="custom-select w-100 ml-2"
                onChange={(e) => setOption(e.target.value)}
              >
                <option value="title">by Bookname</option>
                <option value="authors">by Authorname</option>
              </select>
            </div>
          </Form>
        </Navbar.Collapse>
      </Navbar>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        size="lg"
        centered
        keyboard={false}
      >
        <Modal.Header
          style={{
            backgroundColor: "#222222",
            color: "white",
            border: "1px solid white",
          }}
        >
          <Modal.Title> Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            overflow: "auto",
            maxHeight: "70vh",
            backgroundColor: "#222628",
            color: "white",
            border: "1px solid white",
          }}
        >
          {data.map((e) => {
            return (
              <Card
                key={e.bookID}
                style={{
                  backgroundColor: "#222628",
                  color: "white",
                  borderColor: "lightsteelblue",
                }}
              >
                <Card.Body>
                  <Card.Title>{e.title}</Card.Title>
                  <Card.Text style={{ color: "lightgray" }}>
                    {e.authors}
                  </Card.Text>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Card.Text>Rs. {e.price * e.quantity}</Card.Text>
                    <Card.Text
                      className="Stars"
                      style={{ "--rating": `${e.average_rating}` }}
                    >
                      ({e.average_rating})
                    </Card.Text>
                  </div>
                  <div className="text-center">
                    <Button
                      style={{ outline: "none" }}
                      variant="contained"
                      onClick={() => removeItem(e)}
                      size="small"
                      color="secondary"
                    >
                      {"Remove"}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            );
          })}
          <div
            style={{
              textAlign: "center",
              fontSize: "1.5vw",
              marginTop: "1vw",
              color: "black",
              backgroundColor: "#ccc",
              borderRadius: "10px",
            }}
          >
            Total Price : Rs.{totalcost}
          </div>
        </Modal.Body>
        <Modal.Footer
          style={{
            border: "1px solid white",
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: "#222628",
            color: "white",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            style={{ outline: "none" }}
          >
            Buy
          </Button>
          <Button
            color="default"
            variant="contained"
            onClick={handleClose}
            style={{ outline: "none" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
}
export default NavBar;

NavBar.propTypes = {
  search: PropTypes.string,
  setsearch: PropTypes.func,
  cart: PropTypes.array,
};
