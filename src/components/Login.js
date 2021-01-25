import {Component} from "react";
import { TextField, Button } from "@material-ui/core";
import {global} from "../assets/serverLink";
import "../assets/css/Login.css";

export class Login extends Component{
    render(){

        var user = {
            email: "",
            password: ""
        }

        function changeInput(event){
            const value = event.target.value;
            const data = event.target.getAttribute("name");
            user[data] = value;
        }

        function submit(){
            window.event.preventDefault();
            if(user.email != "" && user.password != ""){
                console.log(user)
                const formData = new FormData();
                for(let i in user) formData.append(i, user[i]);
                fetch(global + "users/login", {
                    method: "POST",
                    body: JSON.stringify(user),
                    headers:{
                        "Content-Type": "application/json"
                    }
                })
                .then(response => response.json())
                .then(result => {
                    if(result.token){
                        sessionStorage.setItem("x-access-token", result.token);
                        window.location.reload();
                    } else {
                        document.querySelector("#messageError").style.display = "block"
                    }
                    console.log(result)
                })
                .catch(err => console.log(err));
            } else {
                document.querySelector("#messageError").style.display = "block"
            }
        }

        return (
        <div id="formulario">
            <h1 id="titleLogin">Login</h1>
            <form onSubmit={submit}>
                <TextField className="input" onChange={changeInput} name="email" type="email" placeholder="Email" label="Email" />
                <TextField className="input" onChange={changeInput} name="password" type="password" placeholder="Password" label="Password" />
                <span id="messageError">User not valid</span>
                <Button type="submit" id="buttonSubmit" variant="contained">Submit</Button>
            </form>
        </div>
        )
    }
}