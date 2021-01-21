import {Component} from "react";
import {Button} from "@material-ui/core";
import { BrowserRouter as Router } from "react-router-dom";
import "../assets/css/Home.css";

export class Home extends Component{
    render(){ 
        return <div id="contentHome"> 
            <h1 id="titleHome">Welcome to ImgShare</h1>
            <Router>
                <Button className="buttonHome" href="/login" id="loginButton" >Login</Button>
                <Button className="buttonHome" href="/register" id="registerButton" >Register</Button>
            </Router>
        </div>
    }
}