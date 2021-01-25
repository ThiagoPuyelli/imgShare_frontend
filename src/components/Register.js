import React, {Component} from "react";
import { Redirect } from "react-router-dom";
import { Button, TextField, InputAdornment, Slider, Avatar } from "@material-ui/core";
import { AccountCircle, Description, Email, Lock } from "@material-ui/icons";
import "../assets/css/Register.css"; 
import { global } from "../assets/serverLink";
import {verifyAuth} from "./methods/verifyAuth";

export class Register extends Component{

    componentWillMount(){
        const auth = verifyAuth();
        if(auth){
            Redirect("/");
        }
    }

    render(){

        var imageFile = undefined,
        srcToAvatar = undefined,
        positionImageWidth = 24,
        positionImageVertical = 0,
        positionImageSize = 110,
        positionMaxWidth = 50,
        positionMaxVertical = 1,
        positionMinVertical = -1,
        user = {
            username: "",
            email: "",
            password: "",
            description: "",
            image: undefined,
            positionImage: ""
        }

        function Sliders(){
            return (
                <div id="slidersContent">
                    <label className="sliderLabel">Horizontal</label>
                    <Slider className="sliderHorizontal slider" id="slider" defaultValue={24} onChange={sliderChangeHorizontal} aria-labelledby="input-slider" min={0} max={positionMaxWidth} />
                    <div id="slidersVertical">
                        <div className="divSlider">
                        <label className="sliderLabel sliderLabelVertical">Vertical</label>
                        <Slider orientation="vertical" onChange={sliderChangeVertical} className="sliderVertical slider" id="slider" defaultValue={0} aria-labelledby="input-slider" min={positionMinVertical} max={positionMaxVertical} />
                        </div>
                        <div className="divSlider">
                        <label className="sliderLabel">Size</label>
                        <Slider orientation="vertical" onChange={sliderChangeSize} className="sliderSize slider" id="slider" defaultValue={110} aria-labelledby="input-slider" min={110} max={220} />
                        </div>
                    </div>
                </div>
            )
        }

        function submitUser(){
            console.log(user)
            const errors = []
            for(let i in user){
                if(i != "image" && i != "positionImage" && i != "description"){
                    if(user[i] == undefined || user[i] == ""){
                        errors.push("message" + i);
                    }
                } 
            }
            if(errors.length < 1){
                var userSend = {
                    username: "",
                    email: "",
                    password: ""
                }
                if(user.image != undefined){
                    const formData = new FormData();
                    for(let i in user){
                        if(i != "image"){
                            if(user[i] != "") formData.append(i, user[i]);
                        } else {
                            formData.append("image", user.image, user.image.name);
                        }
                    }
                    userSend = formData;
                } else {
                    userSend = {
                        ...userSend,
                        description: ""
                    }
                    for(let i in user){
                        if(i != "image" && i != "positionImage"){
                            if(i == "description" && user.description != ""){
                                userSend[i] = user[i];
                            }
                        }
                    }
                }

                fetch(global + "users/register", {
                    method: "POST",
                    body: userSend,
                    cors: "no-cors"
                })
                .then(response => response.json())
                .then(resolve => {
                    if(resolve.token){
                        sessionStorage.setItem("x-access-token", resolve.token);
                        window.location.reload();
                    }
                })
                .catch(err => console.log(err));

            } else {
                for(let i of errors) {
                    try{
                        const message = document.querySelector("#" + i);
                        message.style.display = "block";
                    } catch(err){
                        console.log(err)
                    }
                }
            }
        }
        
        function changeInput(event){
            const value = event.target.value;
            const data  = event.target.getAttribute("name");
            const input = document.querySelector(".input" + data);
            if(data != "description" && data != "password" && value == ""){
                document.querySelector(".input" + data + " label").style.color = "red";
                input.style.borderBottom = "3px solid red"
            } else if(data == "password" && value.length < 4){
                document.querySelector(".input" + data + " label").style.color = "red";
                input.style.borderBottom = "3px solid red"
                document.querySelector("#messagePassword").style.display = "block";
            } else if(data != "description") {
                user[data] = value;
                document.querySelector(".input" + data + " label").style.color = "green";
                input.style.borderBottom = "3px solid green"
                if(data == "password") document.querySelector("#messagePassword").style.display = "none"
            } else if(data == "description"){
                user[data] = value;
            }
        }

        function changeFile(event){
            imageFile = event.target.files[0];
            if(imageFile.type.split("/")[0] == "image"){
                document.querySelector("#messageImage").style.display = "none";
                user.image = imageFile;
                srcToAvatar = URL.createObjectURL(imageFile);
                const avatarRegister = document.querySelector("#avatarRegister");
                avatarRegister.setAttribute("src", srcToAvatar)
                const sliders = document.querySelectorAll(".slider");
                for(let i of sliders) i.style.display = "block";
                document.querySelector("#avatarNone").style.display = "none"
                const labels = document.querySelectorAll(".sliderLabel");
                for(let i of labels) i.style.display = "block";
                document.querySelector("#submitRegister").style.marginTop = "20px"
                user.positionImage = "24 0 110";
                const image = document.querySelector("#avatarRegister"); 
                image.style.marginLeft = "-" + 24 + "px";
                image.style.marginTop = 0 + "px"; 
                image.style.width = 110 + "px";
                document.querySelector(".sliderHorizontal span[role='slider']").setAttribute("aria-valuemax", 24);
                document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemax", 1);
                document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemin", -1);
            } else {
                document.querySelector("#messageImage").style.display = "block";
            }
        }

        function calculeValue(max, min, porcent){

            if(parseInt(min) < 0){
                const value = porcent * (parseInt(max) / 2) / 100;
                return value + parseInt(min) / 2;
            } else {
                const value = porcent * parseInt(max) / 100;
                return value;
            }
        }

        async function sliderChangeHorizontal(){
            const porcent = document.querySelector(".sliderHorizontal .MuiSlider-track").getAttribute("style").split("h: ")[1];
            const max = document.querySelector(".sliderHorizontal span[role='slider']").getAttribute("aria-valuemax");
            var value = await calculeValue(porcent, 0, max)
            value = value * 2;
            value = value - (positionImageSize - 110);
            positionImageWidth = value;
            user.positionImage = value + " " + user.positionImage.split(" ")[1] + " " + user.positionImage.split(" ")[2]; 
            document.querySelector("#avatarRegister").style.marginLeft = "-" + value + "px";
        }

        async function sliderChangeVertical(){
            const porcent = document.querySelector(".sliderVertical .MuiSlider-track").getAttribute("style").split("ht: ")[1];
            const max = document.querySelector(".sliderVertical span[role='slider']").getAttribute("aria-valuemax");
            const min = document.querySelector(".sliderVertical span[role='slider']").getAttribute("aria-valuemin");
            const value = await calculeValue(porcent, min, max)
            positionImageVertical = value;
            user.positionImage = user.positionImage.split(" ")[0] + " " + value + " " + user.positionImage.split(" ")[2]; 
            document.querySelector("#avatarRegister").style.marginTop = value + "px"; 
        }

        async function sliderChangeSize(){
            const image = document.querySelector("#avatarRegister");
            image.style.marginLeft = "-24px"
            image.style.marginTop = "0px";
            document.querySelector(".sliderVertical input[type='hidden']").value = 0;
            document.querySelector(".sliderHorizontal input[type='hidden']").value = -24;

            const value = document.querySelector(".sliderSize input[type='hidden']").value;
            positionImageSize = value;
            const numberToCalc = parseInt(positionImageSize) - 110;
            document.querySelector(".sliderHorizontal span[role='slider']").setAttribute("aria-valuemax", 24 + numberToCalc);
            document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemax", 1 + numberToCalc);
            document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemin", -1 - numberToCalc);

            user.positionImage = user.positionImage.split(" ")[0] + " " + user.positionImage.split(" ")[1] + " " + value;
            image.style.width = value + "px";
        }

        return <div>
            <div id="divRegister">
                <h1 id="titleRegister">Register</h1>
                <form id="formRegister" autoComplete="off">
                    <TextField className="inputRegister inputusername" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        )
                    }} label="Username"  type="text" placeholder="Username" name="username" />
                    <TextField className="inputRegister inputemail" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email />
                            </InputAdornment>
                        )
                    }} label="Email"  type="email" placeholder="Email" name="email" />
                    <TextField className="inputRegister inputpassword" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        )
                    }} label="Password"  type="password" placeholder="Password" name="password" />
                    <span id="messagePassword">4 characters minimum</span>
                    <TextField className="inputRegister inputdescription" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Description />
                            </InputAdornment>
                        )
                    }} label="Description" name="description" multiline placeholder="Description (optional)" />
                    <label id="labelImage">Avatar</label>
                    <input className="inputRegister" onChange={(event) => changeFile(event)} placeholder="avatar"  type="file" id="inputImage" />
                    <span id="messageImage">El archivo no es una imagen</span>
                    <Avatar id="avatarNone" />
                    <div id="contentAvatar">
                    <img id="avatarRegister" src={AccountCircle} />
                    </div>
                    <div id="slidersDiv" style={{width: "100%"}}>
                        <Sliders />
                    </div>
                    <Button id="submitRegister" onClick={submitUser} variant="contained" >Submit</Button>
                    <div id="messages">
                    <span className="messageError" id="messageusername">Username is required</span>
                    <span className="messageError" id="messageemail">Email is required</span>
                    <span className="messageError" id="messagepassword">In password 4 characters minimum</span>
                    </div>
                </form>  
            </div>
        </div>
    }
}