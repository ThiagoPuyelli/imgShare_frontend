import {Component} from "react";
import "../assets/css/Header.css";
import {global} from "../assets/serverLink";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {AppBar, Toolbar, Button} from "@material-ui/core";

export class Header extends Component {
    constructor(props){
        super(props);
        
    }
    
    componentWillMount(){
        if(sessionStorage.getItem("x-access-token")){
            fetch(global + "auth")
            .then(value => value.json)
            .then(response => {
                console.log(response)
            });
        } else {
            this.setState(state => ({
                auth: false
            }));
        }
        
    }
    
    VerifyAuth(){
        if(this.state.auth){
            return true
        } else {
            return false
        }
    }
    
    render(){

        function reload() {
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }

        function ButtonsAuth() {
            return (
                <div id="linksHeader">
                    <Button className="linkHeader">     
                    <Link className="linkHeader" onClick={reload} to="/profile">Profile</Link>
                    </Button>
                    <Button className="linkHeader">     
                    <div href="#" className="linkHeader" onClick={reload} id="logout">Logout</div>
                    </Button>
                </div>
            )
        }

        function ButtonsNotAuth() {
            return (
                <div id="linksHeader">
                    <Button className="linkHeader">
                    <Link className="linkHeader" onClick={reload} to="/login">Login</Link>
                    </Button>
                    <Button className="linkHeader">
                    <Link className="linkHeader" onClick={reload} to="/register">Register</Link>
                    </Button>
                </div>
            )
        }
        
        var VerifyComponent;
        if(this.VerifyAuth()){
            VerifyComponent = ButtonsAuth;
        } else {
            VerifyComponent = ButtonsNotAuth;
        }
        
        return(
            <div id="content">
                <Router>
                <AppBar id="appBar">
                  <Toolbar id="toolbar">
                    <Link id="logo" onClick={reload} href="/" className="linkHeader" to="/">ImgShare</Link>
                    <VerifyComponent />
                  </Toolbar>
                </AppBar>
                </Router>
            </div>
        )
    };
}