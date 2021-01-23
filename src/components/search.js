import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { Form, FormControl, Card } from "react-bootstrap";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import _ from "lodash";
import PropTypes from "prop-types";
import { Button, ButtonGroup } from "@material-ui/core";
import { useEffect } from "react";

function Cart(props) {
  const [quantity, setQuantity] = useState(1);
  const [books, setbook] = useState([]);
  const addData = () => {
    var data = {
      authors: books[0].authors,
      bookID: books[0].bookID,
      title: books[0].title,
      average_rating: books[0].average_rating,
      price: books[0].price,
      isbn: books[0].isbn,
      quantity: quantity,
    };
    var request = window.indexedDB.open("CartDatabase", 2);
    request.onsuccess = (event) => {
      var db = event.target.result;
      var transaction = db.transaction(["cart"], "readwrite");
      var objectStore = transaction.objectStore("cart");
      var request = objectStore.add(data);
      window.location.reload();
    };
  };
  useEffect(() => {
    if (props.cart[0] != undefined) {
      var data = [];
      props.booksList.map((book) => {
        if (book.bookID == props.cart[0].bookID) {
          data.push(book);
        }
      });
      setQuantity(1);
      setbook(data);
    }
  }, [props.cart]);
  return (
    <React.Fragment>
      <div style={{ width: "25vw", borderRight: "2px solid #ccc" }}>
        <div
          style={{
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "1.5vw",
          }}
        >
          Book Details
        </div>
        {props.cart.length == 0 ? (
          <div
            style={{
              fontSize: "1.2vw",
              marginLeft: "4.5vw",
              color: "lightgray",
            }}
          >
            Select book to get its details
          </div>
        ) : (
          <div>
            {books.map((book) => {
              return (
                <Card
                  style={{
                    backgroundColor: "#222628",
                    color: "white",
                    marginTop: "1.2vw",
                  }}
                  className="mx-2 shadow text-center"
                  key={book.bookID}
                >
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <Card.Text style={{ color: "lightgray" }}>
                      {book.authors}
                    </Card.Text>
                    <Card.Text>Rs. {book.price * quantity}</Card.Text>
                    <Card.Text
                      className="Stars"
                      style={{ "--rating": `${book.average_rating}` }}
                    >
                      ({book.average_rating})
                    </Card.Text>
                    <Card.Text>Quantity : {quantity}</Card.Text>
                    <Card.Text>
                      <ButtonGroup style={{ backgroundColor: "lightcyan" }}>
                        <Button
                          aria-label="reduce"
                          style={{ outline: "none" }}
                          onClick={() => {
                            setQuantity(Math.max(quantity - 1, 1));
                          }}
                        >
                          <RemoveIcon fontSize="small" />
                        </Button>
                        <Button
                          aria-label="increase"
                          style={{ outline: "none" }}
                          onClick={() => {
                            setQuantity(quantity + 1);
                          }}
                        >
                          <AddIcon fontSize="small" />
                        </Button>
                      </ButtonGroup>
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button
                      color="primary"
                      onClick={() => addData()}
                      variant="contained"
                      style={{ outline: "none" }}
                    >
                      Add to Cart
                    </Button>
                  </Card.Footer>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </React.Fragment>
  );
}
Cart.propTypes = {
  search: PropTypes.string,
  setsearch: PropTypes.func,
  cart: PropTypes.array,
  booksList: PropTypes.array,
};

export default Cart;
