import axios from "axios";
const indexdbSetup = () => {
  var request = window.indexedDB.open("CartDatabase", 2);
  request.onerror = (e) => {
    console.log(e);
  };
  request.onupgradeneeded = (event) => {
    var db = event.target.result;
    if (!db.objectStoreNames.contains("cart")) {
      var objectStore = db.createObjectStore("cart", { keyPath: "bookID" });
      objectStore.createIndex("bookID", "bookID", { unique: true });
    }
  };
};

const addDataToIndexedDB = (data) => {
  var request = window.indexedDB.open("CartDatabase", 2);
  request.onerror = (e) => {
    console.log(e);
  };
  request.onsuccess = (event) => {
    var db = event.target.result;
    var transaction = db.transaction(["cart"], "readwrite");
    var objectStore = transaction.objectStore("cart");
    var requestq = objectStore.add(data);
  };
};

export { indexdbSetup, addDataToIndexedDB };
