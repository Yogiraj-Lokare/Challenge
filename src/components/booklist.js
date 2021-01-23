import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect } from "react";
import { useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import PropTypes from "prop-types";
import { Checkbox, FormControlLabel } from "@material-ui/core";

function BookList(props) {
  const [gridApi, setGridApi] = useState(null);
  const [rating_count, setRatingCo] = useState(false);
  const [lang, setLang] = useState(false);
  const [isbn, setisbn] = useState(false);
  const [bookId, setBookID] = useState(false);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  function onGridReady(params) {
    setGridApi(params.api);
    params.api.sizeColumnsToFit();
    setGridColumnApi(params.columnApi);
  }
  const selectToCart = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    props.set(selectedData);
  };
  return (
    <React.Fragment>
      <div style={{ height: "85vh", width: "75vw" }}>
        <div
          style={{
            display: "flex",
            color: "white",
            width: "100%",
            justifyContent: "space-around",
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rating_count}
                style={{ color: "white" }}
                onChange={(e) => setRatingCo(e.target.checked)}
                color="primary"
              />
            }
            label="Rating Count"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={lang}
                style={{ color: "white" }}
                onChange={(e) => setLang(e.target.checked)}
                color="primary"
              />
            }
            label="Language Code"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isbn}
                style={{ color: "white" }}
                onChange={(e) => setisbn(e.target.checked)}
                color="primary"
              />
            }
            label="ISBN"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={bookId}
                style={{ color: "white" }}
                onChange={(e) => setBookID(e.target.checked)}
                color="primary"
              />
            }
            label="BookID"
          />
        </div>
        <div
          className="ag-theme-alpine-dark"
          style={{ height: "100%", width: "100%" }}
        >
          <AgGridReact
            onGridReady={onGridReady}
            rowData={props.booksList}
            pagination={true}
            paginationPageSize={20}
            onRowClicked={selectToCart}
            autoHeight={true}
            rowSelection="single"
          >
            <AgGridColumn
              field="title"
              sortable={true}
              cellRenderer={TitleCellRenderer}
              filter={true}
              resizable={true}
              width={400}
            ></AgGridColumn>
            <AgGridColumn
              field="authors"
              cellRenderer={TitleCellRenderer}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="price"
              width={100}
              sortable={true}
              filter="agNumberColumnFilter"
            ></AgGridColumn>
            <AgGridColumn
              field="average_rating"
              cellRenderer={RatingCellRenderer}
              headerName="Rating"
              filter="agNumberColumnFilter"
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="ratings_count"
              hide={!rating_count}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="isbn"
              hide={!isbn}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="bookID"
              hide={!bookId}
              sortable={true}
            ></AgGridColumn>
            <AgGridColumn
              field="language_code"
              hide={!lang}
              sortable={true}
            ></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    </React.Fragment>
  );
}

function RatingCellRenderer() {}

RatingCellRenderer.prototype.init = function (params) {
  this.eGui = document.createElement("span");
  if (
    params.value !== "" ||
    params.value !== undefined ||
    params.value !== null
  ) {
    var Rating = '<div class="Stars" style="--rating:' + params.value + ';">';
    this.eGui.innerHTML = Rating + " (" + params.value + ") ";
  }
};

RatingCellRenderer.prototype.getGui = function () {
  return this.eGui;
};

function TitleCellRenderer() {}

TitleCellRenderer.prototype.init = function (params) {
  this.eGui = document.createElement("span");
  if (
    params.value !== "" ||
    params.value !== undefined ||
    params.value !== null
  ) {
    this.eGui.innerHTML = params.value;
  }
};

TitleCellRenderer.prototype.getGui = function () {
  return this.eGui;
};

export default BookList;

BookList.propTypes = {
  booksList: PropTypes.array,
  set: PropTypes.func,
};
