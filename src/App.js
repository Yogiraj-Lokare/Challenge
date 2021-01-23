import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import BookList from "./components/booklist";
import _ from "lodash";
import NavBar from "./components/navbar";
import Cart from "./components/search";
import { cloneDeep } from "lodash";

function App() {
  const [booksList, setbooksList] = useState([
    {
      title: "name",
      price: "123",
      ratings_count: "3.2",
      average_rating: "122",
      authors: "11",
      bookID: "12",
      isbn: "11",
      language_code: "1en",
    },
  ]);
  const [displyData, setdisplayData] = useState([]);
  const [cart, setCart] = useState([]);
  const searchResults = (field, option) => {
    field = field.trim();
    if (field == "") {
      setdisplayData(booksList);
    } else {
      var results = [];
      var deepcopied = {};
      deepcopied = cloneDeep(booksList);
      deepcopied.map((book) => {
        if (typeof book.title == "string" && typeof book.authors == "string") {
          var index,
            temp = book[option];
          index = temp.toLowerCase().indexOf(field.toLowerCase());
          if (index != -1) {
            temp = book[option].substr(0, index);
            temp += book[option].substr(index, field.length).bold();
            temp += book[option].substr(index + field.length);
            book[option] = temp;
            results.push(book);
          }
        }
      });
      setdisplayData(results);
    }
  };
  useEffect(() => {
    const fetch = async () => {
      const { data } = await axios.get(
        "https://s3-ap-southeast-1.amazonaws.com/he-public-data/books8f8fe52.json"
      );
      setbooksList(data);
      setdisplayData(data);
    };
    fetch();
  }, []);
  return (
    <React.Fragment>
      <NavBar setsearch={searchResults} />
      <div className="d-flex flex-row">
        <Cart cart={cart} booksList={booksList} />
        <BookList set={setCart} booksList={displyData} />
      </div>
    </React.Fragment>
  );
}

export default App;
