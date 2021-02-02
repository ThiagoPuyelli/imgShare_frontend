import {Component} from "react";
import {global} from "../assets/serverLink";
import {BrowserRouter as Router, useParams} from "react-router-dom";

export class Profile extends Component{
    
    constructor(props){
        super(props)

        this.findProfile = this.findProfile.bind(this);
    }

    componentDidMount(){
        this.findProfile();
    }

    findProfile(){
        setTimeout(() => {
            if(sessionStorage.getItem("x-access-token")){
                fetch(global + "users/" + 1, {
                    method: "GET",
                    headers: {
                        "x-access-token": sessionStorage.getItem("x-access-token")
                    }
                })
                .then(response => response.json())
                .then(result => {
                    this.setState(state => ({
                        profile: result
                    }));
                })
                .catch(err => console.log(err));
            }
        }, 500);
    }

    render(){

        return <h1>Perfil de usuario</h1>
    }
}