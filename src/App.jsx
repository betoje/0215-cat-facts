import { useState, useEffect, useReducer } from "react";
import axios from "axios";
// import { Button } from "react-bootstrap";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";

const baseURL = "https://cat-fact.herokuapp.com";

function App() {
  // const { useState, useEffect, useReducer } = React;
  // const { Button } = ReactBootstrap;

  const initialCatFacts = [
    {
      text: "",
      user: "",
    },
  ];

  const [catFacts, setCatFacts] = useState(initialCatFacts);
  const [catLength, setCatlength] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // invalid url will trigger an 404 error
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/facts/random?animal_type=cat&amount=500`
        );
        const dataFiltered = response.data.filter(
          (element) => element.status.verified === true
        );
        const dataReduced = dataFiltered.map((element) => ({
          text: element.text,
          user: element.user,
        }));
        setCatlength(dataReduced.length);
        console.log(response);
        console.log(dataReduced);
        console.log(dataReduced[0].text);
        setCatFacts(dataReduced);
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  if (error) return `Error: ${error.message}`;
  if (!setCatFacts) return "No cat facts!";

  const nextValidatedGroup = () => {};

  return (
    <>
      <div className="container">
        <h1 className="text-center"> Cat Facts</h1>
        <div className="text-center">
          <button
            className="btn btn-success text-center align-center"
            onClick={nextValidatedGroup}
          >
            Next aleatory validated group (from 500 facts)
          </button>
        </div>
        {catLength ? (
          <p className="text-success text-center">
            {catLength} validated facts
          </p>
        ) : (
          <></>
        )}
      </div>
      <ul className="row">
        {catFacts.map((element, index) => {
          return (
            <div key={index} className="col">
              <li
                className="card p-y-4"
                style={{ minWidth: "300px", minHeight: "300px" }}
              >
                <p className="card-body bg-primary text-light">
                  {element.text}
                </p>
                <p className="card-title text-center bg-warning">
                  From user: <strong>{element.user}</strong>
                </p>
              </li>
            </div>
          );
        })}
      </ul>
    </>
  );
}

export default App;

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <App />
// )
