import './assets/css/App.css';
import {Header} from "./components/Header";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom" 
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { Home } from "./components/Home";
import { HomeAuth } from "./components/HomeAuth";
import { CreatePost } from "./components/CreatePost";
import {verifyAuth} from "./components/methods/verifyAuth";

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
          <HomeAuth />
        </Route>
      </Switch>
    )
  }

  function Content(){
    const auth = verifyAuth();
    if(auth == true){
      return <Auth />
    } else {
      return <NoAuth />
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
