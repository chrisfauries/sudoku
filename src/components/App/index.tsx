import { RecoilRoot } from "recoil";
import EventBoundary from "../EventBoundary";
import React from "react";
import Sudoku from "../Sudoku";

const App = () => {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <EventBoundary>
          <Sudoku />
        </EventBoundary>
      </RecoilRoot>
    </React.StrictMode>
  );
};

export default App;
