import {Component} from "react";
import "../assets/css/Header.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {AppBar, Toolbar, Button} from "@material-ui/core";
import {verifyAuth} from "./methods/verifyAuth";
import {CreatePost} from "./CreatePost";
import {global} from "../assets/serverLink";

export class Header extends Component {
    constructor(props){
        super(props);
        this.state = {
            image: {}
        }

        this.findImage = this.findImage.bind(this);
        this.Avatar = this.Avatar.bind(this);
    }

    findImage(){
        if(sessionStorage.getItem("x-access-token")){
            fetch(global + "users/" + sessionStorage.getItem("x-access-token").split("|")[1], {
                method: "GET",
                headers: {
                    "x-access-token": sessionStorage.getItem("x-access-token")
                }
            } )
            .then(response => response.json())
            .then(res => {
                this.setState(state => ({
                    image: res.image
                }))
            })
            .catch(err => console.log(err));
        }
    }
    
    componentWillMount(){
        const auth = verifyAuth();
        this.setState(state => ({
            auth
        }))
        this.findImage();
    }
    
    VerifyAuth(){
        if(this.state.auth){
            return true
        } else {
            return false
        }
    }

    Avatar(){
        return this.state.image;
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

        function returnAvatar(){
            console.log(this.Avatar());
        }

        function ButtonsAuth() {

            return (
                <div id="linksHeader">
                    <Button className="linkHeader">     
                    <Link className="linkHeader" onClick={reload} to="/profile">
                        Profile
                        </Link>
                    </Button>
                    <Button onClick={logout} className="linkHeader">     
                    <div href="#" className="linkHeader" onClick={reload} id="logout">Logout</div>
                    </Button>
                    <Button className="linkHeader">
                        <Link className="linkHeader" onClick={reload} to="/create">Public Post</Link>
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