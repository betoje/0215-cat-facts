import { useState, useEffect, useReducer } from "react";
import axios from "axios";
// import { Button } from "react-bootstrap";
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

// const { useState, useEffect, useReducer } = React;
// const { Button } = ReactBootstrap;
import "./App.css";

const baseURL = "https://cat-fact.herokuapp.com";

function App() {

  const initialCatFacts = [
    [{
      text: "",
      user: "",
    }],
  ];

  const [catFacts, setCatFacts] = useState(initialCatFacts);
  const [catLength, setCatlength] = useState(0);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(8);
  const [nextGroup, setNextGroup] = useState(true);

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
        setCatFacts(arrayGroup(dataReduced, pageSize));
        
        // setCatFacts(arrayGroup(dataReduced, 8));
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, [nextGroup]);

  const arrayGroup = (arr, groupSize) => {
    let len = arr.length;
    let groupQtyDown = Math.trunc(len / groupSize);
    let groupQty = Math.ceil(len / groupSize);
    let newArr = []; 
    let z = 0;
    for (let i = 0; i < groupQty; i++) {
      if ((i === groupQty -1) & (groupQty !== groupQtyDown)) 
        groupSize = len - groupSize * groupQtyDown;
      let newGrp = [];
      for (let j = 0; j < groupSize; j++) {
        newGrp.push(arr[z]);
        z++;
      }
      newArr.push(newGrp);
    }
    return newArr;
  } 

  const catFactsGrouped = arrayGroup(catFacts, 8);
  console.log(catFactsGrouped);
  console.log(catFactsGrouped[0]);
  

  if (error) return `Error: ${error.message}`;
  if (!catFacts) return "No cat facts!";

  const nextValidatedGroup = () => {
    setNextGroup(!nextGroup);
  };

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
        <nav>
          <br />
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <button onClick={() => {
                console.log(`page: ${page}, pageSize: ${pageSize}`);
                page >= 1 && setPage(page - 1);
              }} className="page-link">Previous</button>
            </li>
            <li onClick={ () => {
              console.log(`page: ${page} catLength: ${catLength}, pageSize: ${pageSize}`);
              page < (Math.ceil(catLength / pageSize) - 1) && setPage(page + 1);
            }} className="page-item">
              <button className="page-link">Next</button>
            </li>
          </ul>
        </nav>
        {catLength ? (
          <p className="text-success text-center">
            {catLength} validated facts (groups of {pageSize} each)
          </p>
        ) : (
          <></>
        )}
      </div>
      <ul className="row">
        {console.log(page)}
        {console.log(catFacts)}
        {catFacts[page].map((element, index) => {
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
