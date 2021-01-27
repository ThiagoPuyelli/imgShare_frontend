import {Component} from "react";
import "../assets/css/ListPosts.css";
import {global} from "../assets/serverLink";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

export class ListPosts extends Component{

    constructor(props){
        super(props);
        this.state = {
            posts: []
        };

        this.Posts = this.Posts.bind(this);
    }

    componentWillMount(){
        fetch(global + "posts", {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
            this.setState(state => ({
                posts: result
            }))
        })
        .catch(err => console.log(err))
    }

    likPost(id){
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
                    var inputLike = document.querySelector("#post" + id + " .postFavorite");
                    inputLike.style.marginTop = "-10px";
                    inputLike.innerHTML = <Favorite />;
                    inputLike.style.marginTop = "0px";
                })
                .catch(err => console.log(err))          
            } 
        })
        .catch(err => console.log(err))
    }

    Post(srcImage, likes, description, username, id){

        var favorite = <FavoriteBorder />;

        fetch(global + "lik-verify/" + id, {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(result => {
            if(result.lik == true){
                favorite = <Favorite />;

            }
        })
        .catch(err => console.log(err));
        
        return (
            <div className="post" id={"post" + id}>
                <img src={srcImage} className="postImage" />
                <div className="divUserLikes">
                    <a className="postUser" href="#">{username}</a>
                    <span className="postLikes">
                        <span className="postFavorite" onClick={(event) => this.likPost(id)}>{favorite}</span>
                        <span className="postNumberLikes">{likes}</span>
                    </span>
                </div>
                {description != "" && 
                <p className="postDescription">{description}</p>
                }
            </div>
        )
    }

    Posts(){
        var arrayPosts = []
        for(let i of this.state.posts) arrayPosts.push(this.Post(i.image, i.likes, i.description, i.user.username, i.id))
        return arrayPosts;
    }

    render(){

        return (
            <div id="contentList">
                <this.Posts />
            </div>
        )
    }
}