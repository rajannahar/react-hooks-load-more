import React, { useReducer, useContext, createContext } from 'react';
import './App.css';

const allData = new Array(25).fill(0).map((_val, i) => i+1);
const perPage = 10;
const types = {
  start: "START",
  loaded: "LOADED"
};

// reducer switch statements
const reducer = (state, action) => {
  switch (action.type) {
    case types.start:
      return { ...state, loading: true };
    case types.loaded:
      return {
        ...state,
        loading: false,
        data: [...state.data, ...action.newData],
        more: action.newData.length === perPage,
        after: state.after + action.newData.length
      };
    default:
      throw new Error("Don't understand action");
  }
}

const MyContext = createContext();

function MyProvider({children}) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    more: true,
    data: [],
    after: 0
  });

  const { loading, data, after, more } = state;

  const load = () => {
    dispatch({ type: types.start });

    setTimeout(() => {
      const newData = allData.slice(after, after + perPage);
      dispatch({ type: types.loaded, newData });
    }, 500);
  };

  // Provide values/data to MyContext children from reducer, dispatch
  return <MyContext.Provider value={{loading, data, more, load}}>{children}</MyContext.Provider>;
}

function App() {

  // Extract data from Context here
  const { data, loading, more } = useContext(MyContext);

  return (
    <div className="App">
      <ul>
        {data.map(row => (
          <li key={row} style={{ background: "orange" }}>
            {row}
          </li>
        ))}

        {loading && <li>Loading...</li>}

        {!loading && more && <LoadMore />}

      </ul>
    </div>
  )
}

function LoadMore() {
  const { load } = useContext(MyContext);
  return <li style={{ background: "green" }}>
    <button onClick={load}>Load More</button>
  </li>
}

// Wrap App in MyProvider to give it Context
export default () => {
  return <MyProvider>
    <App />
  </MyProvider>
}