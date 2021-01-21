import './assets/css/App.css';
import {Header} from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom" 
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";

function App() {


  function NoAuth(){
    return (
      <Switch>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    )
  }

  function Auth(){
    return (
      <Switch>
        <Route to="/">
          <Home />
        </Route>
      </Switch>
    )
  }

  function Content(){
    if(sessionStorage.getItem("x-access-token")){
      fetch(global + "auth")
      .then(value => value.json)
      .then(response => {
          console.log(response);
          return <Auth />;
      });
    } else {
        return <NoAuth />;
    }
  }
  
  return (
    <div className="App">
      <Router>
        <Header />
        <div id="contentApp">
        <Content />
        </div>
      </Router>
    </div>
  );
}

export default App;
