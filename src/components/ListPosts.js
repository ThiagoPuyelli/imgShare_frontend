import {Component} from "react";
import "../assets/css/ListPosts.css";
import {global} from "../assets/serverLink";
import { CollectionsOutlined, Favorite, FavoriteBorder } from "@material-ui/icons";
import { Redirect } from "react-router-dom";

export class ListPosts extends Component{

    constructor(props){
        super(props);
        this.state = {
            posts: [],
            like: false
        };

        this.getPosts = this.getPosts.bind(this);
        this.Posts = this.Posts.bind(this)
        this.verifyLike = this.verifyLike.bind(this);

    }

    componentDidMount(){
        this.getPosts();
        setTimeout(() => this.verifyLike(), 500)
    }

    getPosts(){
        fetch(global + "posts", {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(result => {
            this.setState(state => ({
                posts: result
            }))
        })
        .catch(err => console.log(err))
    }
    
    verifyLike(){
        for(let i in this.state.posts){
            fetch(global + "lik-verify/" + this.state.posts[i].id, {
                method: "GET",
                headers: {
                    "x-access-token": sessionStorage.getItem("x-access-token")
                }
            })
            .then(response => response.json())
            .then(result => {
                if(result.lik == true){
                    this.setState(state => ({
                        ["like" + this.state.posts[i].id]: true
                    })) 
                }
                
            })
            .catch(err => console.log(err));
        }
    }

    redirectProfile(id){
        sessionStorage.setItem("userID", id);
        Redirect("/profile");
    }
    
    Post(srcImage, likes, description, username, id){

        if(this.state["like" + id]){
            document.querySelector("#post" + id + " .favoriteBorder").style.display = "none";
            document.querySelector("#post" + id + " .favorite").style.display = "block";
        }
        
        return (
            <div className="post" id={"post" + id} >
                <img src={srcImage} className="postImage" />
                <div className="divUserLikes">
                    <a className="postUser" href={"/profile/" + id}>{username}</a>
                    <span className="postLikes">
                        <span className="postFavorite favoriteBorder" onClick={(event) => {this.likPost(id)}} ><FavoriteBorder /></span>
                        <span className="postFavorite favorite" onClick={(event) => this.deleteLikPost(id)} ><Favorite /></span>
                        <a><span className="postNumberLikes">{likes}</span></a>
                    </span>
                </div>
                {description != "" && 
                <p className="postDescription">{description}</p>
                }
            </div>
        )
    }

    Posts(){

        var arrayPosts = [];
        for(let i of this.state.posts) {
            arrayPosts.push(this.Post(i.image, i.likes, i.description, i.user.username, i.id))
            console.log(this.state["like" + i.id])
        }

        return arrayPosts
    }
    
    likPost(id){
        var number = document.querySelector("#post" + id +  " .postNumberLikes");
        number.innerHTML = parseInt(number.innerHTML) + 1;
        var inputLike = document.querySelector("#post" + id + " .favoriteBorder");
        var like = document.querySelector("#post" + id + " .favorite");
        inputLike.style.display = "none";
        like.style.display = "block";
        fetch(global + "lik-verify/" + id, {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(result => {
            if(result.lik == false){
                fetch(global + "lik/" + id, {
                    method: "GET",
                    headers: {
                        "x-access-token": sessionStorage.getItem("x-access-token")
                    }
                })
                .then(response => response.json())
                .then(res => {
                })
                .catch(err =>{
                    var number = document.querySelector("#post" + id +  " .postNumberLikes");
                    number.innerHTML = parseInt(number.innerHTML) - 1;
                    var inputLike = document.querySelector("#post" + id + " .favorite");
                    var like = document.querySelector("#post" + id + " .favoriteBorder");
                    inputLike.style.display = "none";
                    like.style.display = "block";
                })          
            } 
        })
        .catch(err => console.log(err))
    }

    deleteLikPost(id){
        var number = document.querySelector("#post" + id +  " .postNumberLikes");
        number.innerHTML = parseInt(number.innerHTML) - 1;
        var inputLike = document.querySelector("#post" + id + " .favorite");
        var like = document.querySelector("#post" + id + " .favoriteBorder");
        inputLike.style.display = "none";
        like.style.display = "block";
        fetch(global + "lik/" + id, {
            method: "DELETE",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(result => {

        })
        .catch(err => {
            var number = document.querySelector("#post" + id +  " .postNumberLikes");
            number.innerHTML = parseInt(number.innerHTML) + 1;
            var inputLike = document.querySelector("#post" + id + " .favoriteBorder");
            var like = document.querySelector("#post" + id + " .favorite");
            inputLike.style.display = "none";
            like.style.display = "block";
        });
    }
    
    render(){

        return (
            <div id="contentList">
                <this.Posts />
            </div>
        )
    }
}