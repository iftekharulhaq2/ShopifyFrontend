import React, { useState } from "react";

import "./styles.css";

export default function App() {
  const initialState = JSON.parse(localStorage.getItem("nominate")) || [];
  console.log(initialState);

  const [input, setInput] = useState();
  const [reachedLimit, setReachedLimit] = useState(false);
  const [text, setText] = useState();
  const [search, setSearch] = useState([]);
  const [nominate, setNominate] = useState(initialState);
  const [error, setError] = useState();

  const handleClick = (e) => {
    console.log(input);
    setText(input);
    const val = input;
    fetch(`https://www.omdbapi.com/?s=${val}&apikey=28c15756&type=movie`)
      .then((resp) => resp.json())
      .then((resp) => {
        if (resp.Response === "False") {
          setError(resp.Error);
          setInterval(() => {
            setError(null);
          }, 4000);
        } else {
          setSearch(resp.Search);
        }
      })

      .catch((err) => console.log(err));
  };
  const handleChange = (e) => {
    setInput(e.target.value);
  };
  const handleRemove = (id) => {
    let selection = nominate.filter((item) => item.imdbID !== id);
    setNominate(selection);
    localStorage.setItem("nominate", JSON.stringify(selection));
    setReachedLimit(false);
  };
  const handleNominate = (id) => {
    if (nominate.length < 5) {
      let selection = search.filter((item) => item.imdbID === id);
      console.log("is this arry", selection);
      let arr = nominate;
      arr.push(selection[0]);
      // console.log("from here", arr);
      // setNominate(prevState => ...prevState,selection);
      setNominate(arr);

      console.log(nominate);
      let removeSelection = search.filter((item) => item.imdbID !== id);
      setSearch(removeSelection);
      localStorage.setItem("nominate", JSON.stringify(nominate));
    } else {
      setReachedLimit(true);
    }
  };

  return (
    <div className="App">
      <div className="container my-5">
        <img
          alt="nominations"
          src="https://www.meetingsnet.com/sites/meetingsnet.com/files/styles/article_featured_retina/public/nominations-changemakers.jpg?itok=NpHmKkV6"
          style={{ width: "30rem", height: "15rem", borderRadius: "5px" }}
        />
        {reachedLimit ? (
          <div class="alert alert-danger" role="alert">
            <strong> You have reached the limit of Five nominations </strong>
          </div>
        ) : null}
        {error ? (
          <div
            class="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            <strong>{error}</strong>
            <button
              type="button"
              class="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        ) : null}
        <div className="input-group my-5">
          <input
            type="text"
            className="form-control"
            placeholder="Movie name"
            aria-label="Movie name"
            aria-describedby="button-addon2"
            onChange={handleChange}
          />
          <button
            className="ml-2 btn btn-primary "
            type="button"
            id="button-addon2"
            onClick={handleClick}
          >
            <strong> Search </strong>
          </button>
        </div>

        <div className="row">
          <div className="col">
            {search ? (
              <button type="button" class="btn btn-primary">
                {text} <span class="badge badge-light">{search.length}</span>
              </button>
            ) : (
              <h3>Search Appears here</h3>
            )}
            <ol>
              {search
                ? search.map((item) => (
                    <div class="card mb-3 mt-2">
                      <div class="row g-0">
                        <div class="col-md-4">
                          <img
                            src={item.Poster}
                            alt={`${item.Title} Poster`}
                            style={{ height: "10em", width: "10em" }}
                          />
                        </div>
                        <div class="col-md-8">
                          <div class="card-body ">
                            <h5 class="card-title">{item.Title}</h5>
                            <p class="card-text">{item.Year}</p>
                            <button
                              className="mx-5 mt-2 btn btn-success"
                              type="button"
                              id="button-addon2"
                              onClick={() => handleNominate(item.imdbID)}
                            >
                              Nominate
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </ol>
          </div>

          <div className="col">
            <button type="button" class="btn btn-success">
              Nominated <span class="badge badge-light">{nominate.length}</span>
            </button>
            <ol>
              {nominate
                ? nominate.map((item) => (
                    <div class="card mb-3 mt-2">
                      <div class="row g-0">
                        <div class="col-md-4">
                          <img
                            src={item.Poster}
                            alt={`${item.Title} Poster`}
                            style={{ height: "10em", width: "10em" }}
                          />
                        </div>
                        <div class="col-md-8">
                          <div class="card-body">
                            <h5 class="card-title">{item.Title}</h5>
                            <p class="card-text">{item.Year}</p>
                            <button
                              className="mx-5 mt-2 btn btn-danger"
                              type="button"
                              id="button-addon2"
                              onClick={() => handleRemove(item.imdbID)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : null}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
