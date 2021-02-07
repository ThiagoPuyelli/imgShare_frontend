import {Component} from "react";
import "../assets/css/Header.css";
import { BrowserRouter as Router, Link } from "react-router-dom";
import {AppBar, Toolbar, Button, makeStyles} from "@material-ui/core";
import {verifyAuth} from "./methods/verifyAuth";
import {global} from "../assets/serverLink";
import menuSvg from "../assets/img/menu.svg";

export class Header extends Component {

    constructor(props){
        super(props);
        this.state = {
            image: {},
            positionImage: "-24 0 110"
        }
        
        this.findImage = this.findImage.bind(this);
        this.returnImage = this.returnImage.bind(this);
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
                    image: res.image,
                    positionImage: res.positionImage
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
    
    useStyles = (marginLeft, marginTop, width) =>  {
        return makeStyles({
            imageAvatar: {
                marginLeft,
                marginTop,
                width
            }
        })
    }
    
    VerifyAuth(){
        if(this.state.auth){
            return true
        } else {
            return false
        }
    }

    returnImage(){
        var marginLeft
        if(parseInt(this.state.positionImage.split(" ")[0] <= 0)){
            marginLeft = 0 + "px !important";
        } else {
            marginLeft = "-" + this.state.positionImage.split(" ")[0] + "px !important";
        }
        const marginTop = this.state.positionImage.split(" ")[1] + "px !important";
        const width = this.state.positionImage.split(" ")[2] + "px !important";
        const styles = this.useStyles(marginLeft, marginTop, width);

        return (
            <div id="contentAvatar">
                <img src={this.state.image} id="avatarRegister" className={styles().imageAvatar} />
            </div>
        )
    }
    
    render(){
        
        var ImageProfile = this.returnImage;
        var header = document.querySelector("#toolbar");

        function reload() {
            setTimeout(() => {
                window.location.reload();
            }, 50);
        }

        function reloadProfile(){
            setTimeout(() => {
                sessionStorage.setItem("userID", sessionStorage.getItem("x-access-token").split("|")[1]);
                window.location.reload();
            })
        }

        function logout(){
            sessionStorage.removeItem("x-access-token");
            window.location.reload();
        }
       
        function toogle(){
            var imageToggle = document.querySelector(".imageToggle");
            if(header.style.height == "75px"){
                imageToggle.style.transform = "rotateZ(90deg)"
                header.style.height = "231px";
            } else {
                imageToggle.style.transform = "rotateZ(0deg)"
                header.style.height = "75px";
            }
        }

        function ButtonsAuth() {

            return (
                <div id="linksHeader" className="linksHeaderAuth">
                    <Button className="linkHeader linkHeaderAuth">     
                    <Link className="linkHeader linkHeaderAuth" id="linkProfile" onClick={reloadProfile} to="/profile">
                        <ImageProfile />
                        Profile
                        </Link>
                    </Button>
                    <Button onClick={logout} className="linkHeader linkHeaderAuth">     
                    <div href="#" className="linkHeader linkHeaderAuth" onClick={reload} id="logout">Logout</div>
                    </Button>
                    <Button className="linkHeader linkHeaderAuth">
                        <Link className="linkHeader linkHeaderAuth" onClick={reload} to="/create">Public Post</Link>
                    </Button>
                    <img src={menuSvg} className="imageToggle" onClick={toogle} />
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