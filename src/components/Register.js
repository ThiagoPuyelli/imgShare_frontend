import {Component} from "react";
import { Button, TextField, InputAdornment, Slider, Avatar } from "@material-ui/core";
import { AccountCircle, Description, Email, Lock } from "@material-ui/icons";
import "../assets/css/Register.css"; 

export class Register extends Component{
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
            image: File,
            positionImage: "24 0 110"
        }
        
        function changeInput(event){
            const value = event.target.value
            const data  = event.target.getAttribute("id");
            user[data] = value;
        }

        function changeFile(event){
            imageFile = event.target.files[0];
            if(imageFile.type.split("/")[0] == "image"){
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
            }
        }

        function calculeValue(span, max, min, porcent){

            if(parseInt(min) < 0){
                const value = porcent * (parseInt(max) / 2) / 100;
                return value + parseInt(min) / 2;
            } else {
                const value = porcent * parseInt(max) / 100;
                return value;
            }
        }

        async function sliderChangeHorizontal(){
            const input = document.querySelector(".sliderHorizontal input[type='hidden']");
            const porcent = document.querySelector(".sliderHorizontal .MuiSlider-track").getAttribute("style").split("h: ")[1];
            const max = document.querySelector(".sliderHorizontal span[role='slider']").getAttribute("aria-valuemax");
            const value = await calculeValue(input, porcent, 0, max)
            positionImageWidth = value;
            user.positionImage = value + " " + user.positionImage.split(" ")[1] + " " + user.positionImage.split(" ")[2]; 
            document.querySelector("#avatarRegister").style.marginLeft = "-" + value + "px";
        }

        async function sliderChangeVertical(){
            const input = document.querySelector(".sliderVertical input[type='hidden']");
            const porcent = document.querySelector(".sliderVertical .MuiSlider-track").getAttribute("style").split("ht: ")[1];
            const max = document.querySelector(".sliderVertical span[role='slider']").getAttribute("aria-valuemax");
            const min = document.querySelector(".sliderVertical span[role='slider']").getAttribute("aria-valuemin");
            const value = await calculeValue(input, porcent, min, max)
            positionImageVertical = value;
            user.positionImage = user.positionImage.split(" ")[0] + " " + " " + value + " " + user.positionImage.split(" ")[2]; 
            document.querySelector("#avatarRegister").style.marginTop = value + "px"; 
        }

        async function sliderChangeSize(){
            const value = document.querySelector(".sliderSize input[type='hidden']").value;
            positionImageSize = value;
            const numberToCalc = parseInt(positionImageSize) - 110;
            document.querySelector(".sliderHorizontal span[role='slider']").setAttribute("aria-valuemax", 24 + numberToCalc);
            document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemax", 1 + numberToCalc);
            document.querySelector(".sliderVertical span[role='slider']").setAttribute("aria-valuemin", -1 - numberToCalc);

            // Horizontal
            const inputHorizontal = document.querySelector(".sliderHorizontal input[type='hidden']");
            const porcentHorizontal = document.querySelector(".sliderHorizontal .MuiSlider-track").getAttribute("style").split("h: ")[1];
            const maxHorizontal = document.querySelector(".sliderHorizontal span[role='slider']").getAttribute("aria-valuemax");
            const valueHorizontal = await calculeValue(inputHorizontal, porcentHorizontal, 0, maxHorizontal)
            document.querySelector("#avatarRegister").style.marginLeft = "-" + valueHorizontal + "px";

            // Vertical
            const inputVertical = document.querySelector(".sliderVertical input[type='hidden']");
            const porcentVertical = document.querySelector(".sliderVertical .MuiSlider-track").getAttribute("style").split("ht: ")[1];
            const maxVertical = document.querySelector(".sliderVertical span[role='slider']").getAttribute("aria-valuemax");
            const valueVertical = await calculeValue(inputVertical, porcentVertical, maxVertical)

            document.querySelector("#avatarRegister").style.marginTop = valueVertical + "px";

            user.positionImage = user.positionImage.split(" ")[0] + " " + user.positionImage.split(" ")[1] + " " + value;
            document.querySelector("#avatarRegister").style.width = value + "px";
        }

        return <div>
            <div id="divRegister">
                <h1 id="titleRegister">Register</h1>
                <form id="formRegister" autoComplete="off">
                    <TextField className="inputRegister" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        )
                    }} label="Username"  type="text" placeholder="Username" name="username" />
                    <TextField className="inputRegister" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Email />
                            </InputAdornment>
                        )
                    }} label="Email"  type="email" placeholder="Email" name="email" />
                    <TextField className="inputRegister" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Lock />
                            </InputAdornment>
                        )
                    }} label="Password"  type="password" placeholder="Password" name="password" />
                    <TextField className="inputRegister" onChange={(event) => changeInput(event)} InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Description />
                            </InputAdornment>
                        )
                    }} label="Description" name="description" multiline placeholder="Description (optional)" />
                    <label id="labelImage">Avatar</label>
                    <input className="inputRegister" onChange={(event) => changeFile(event)} placeholder="avatar"  type="file" id="inputImage" />
                    <Avatar id="avatarNone" />
                    <div id="contentAvatar">
                    <img id="avatarRegister" src={AccountCircle} />
                    </div>
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
                    <Button id="submitRegister" type="submit" variant="contained" >Submit</Button>
                    <div onClick={console.log(user)}>Mostrar por consola</div>
                </form>  
            </div>
        </div>
    }
}