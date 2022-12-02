import React from "react";
import './App.css';
import FormPage from './FormPage/FormPage';
import QuestionsPage from "./QuestionsPage/QuestionsPage";
import {BrowserRouter as Router, Route,Switch, Link} from "react-router-dom";

function App() {
  const [response, setResponse] = React.useState();
  return (
    <div style={{ backgroundImage: `url("https://img.freepik.com/free-photo/arrangement-movie-elements-blue-background-with-copy-space_23-2148457886.jpg?w=2000")` }}>
    <Router>
        <Switch>
          <Route exact path="/" render={() => <FormPage handleApiResponse={(response)=>{setResponse(response)}}/>} ></Route>
          <Route exact path="/QuestionsPage" render={() => <QuestionsPage apiResponse={response} />}></Route>
        </Switch>
      </Router>
      </div>
  );
}

export default App;
