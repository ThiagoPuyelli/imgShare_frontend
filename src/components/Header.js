import {Component} from "react";
import "../assets/css/Header.css";
import {global} from "../assets/serverLink";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {AppBar, Toolbar, Button} from "@material-ui/core";
import {verifyAuth} from "./methods/verifyAuth";

export class Header extends Component {
    constructor(props){
        super(props);
        
    }
    
    componentWillMount(){
        const auth = verifyAuth();
        this.setState(state => ({
            auth
        }))
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

        function logout(){
            sessionStorage.removeItem("x-access-token");
            window.location.reload();
        }

        function ButtonsAuth() {
            return (
                <div id="linksHeader">
                    <Button className="linkHeader">     
                    <Link className="linkHeader" onClick={reload} to="/profile">Profile</Link>
                    </Button>
                    <Button onClick={logout} className="linkHeader">     
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