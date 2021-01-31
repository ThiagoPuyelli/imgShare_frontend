import {Component} from "react";
import "../assets/css/CreatePost.css";
import { TextField, Button } from "@material-ui/core";
import {global} from "../assets/serverLink";
import {Redirect} from "react-router-dom";

export class CreatePost extends Component{

    constructor(props){
        super(props);
        this.state = {
            description: undefined,
            image: undefined
        }

        this.changeFile = this.changeFile.bind(this)
        this.changeDescription = this.changeDescription.bind(this)
        this.submitPost = this.submitPost.bind(this)
    }

    changeFile(event){
        const value = event.target.files[0];
        const messageErrorImage = document.querySelector("#messageErrorImage");
        if(value){
            if(value.type.split("/")[0] == "image"){
                messageErrorImage.style.display = "none";

                this.setState(state => ({
                    image: value
                }));

                const divImage = document.querySelector("#divImage");
                if(value.size <= 2000){
                    divImage.style.width = "auto";
                    divImage.style.height = "auto";
                } else {
                    divImage.style.width = "450px";
                    divImage.style.height = "240px";
                }
    
                const imagePost = document.querySelector("#imagePost");
                const urlImage = URL.createObjectURL(value);
                imagePost.src = urlImage;
            } else {
                messageErrorImage.style.display = "block";
            }
        } else {
            messageErrorImage.style.display = "block";
        }
    }    

    changeDescription(event){
        const value = event.target.value;
        if(value != ""){
            this.setState(state => ({
                description: value
            }))
        } else {
            this.setState(state => ({
                description: undefined
            }))
        }
    }

    submitPost(){
        window.event.preventDefault();
        const { image, description } = this.state;
        if(image){
            var post
            if(description){
                post = {
                    image,
                    description,
                }
            } else {
                post = {image};
            }
            var formData = new FormData();

            for(let i in post) formData.append(i, post[i]);

            fetch(global + "posts",{
                method: "POST",
                body: formData,
                cors: "no-cors",
                headers: {
                    "x-access-token": sessionStorage.getItem("x-access-token")
                }
            })
            .then(response => response.json())
            .then(response => {
                if(response){
                    Redirect("/")
                    window.location.reload();
                }
            })
            .catch(err => console.log(err));
        }

    }

    render(){

        /*function submitPost(){
            window.event.preventDefault();
            console.log(this.returnState)
            
            if(image){
                var post
                if(description){
                    post = {
                        image,
                        description,
                    }
                } else {
                    post = {image};
                }
    
                fetch(global + "posts",{
                    method: "POST",
                    body: post,
                    headers: {
                        "Content-Type": "multipart/formdata"
                    }
                })
                .then(response => response.json())
                .then(response => console.log(response))
                .catch(err => console.log(err));
            }

        }*/

        return (<div id="divFormulario">
            <h1>Create post</h1>
            <form onSubmit={this.submitPost} id="formCreate">
                <TextField name="image" onChange={(event) => this.changeFile(event)} className="inputCreate" type="file" />
                <span id="messageErrorImage">Image is not valid</span>
                <div id="divImage">
                    <img id="imagePost" />
                </div>
                <TextField name="description" onChange={(event) => this.changeDescription(event)} className="inputCreate inputDescriptionCreate" type="text" label="description" multiline placeholder="Description (optional)" />
                <Button variant="contained" type="submit" className="inputCreate">Submit</Button>
            </form>
        </div>)
    }
}