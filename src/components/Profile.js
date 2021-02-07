import {Component} from "react";
import {global} from "../assets/serverLink";
import "../assets/css/Profile.css";
import { makeStyles } from "@material-ui/core";
import { Favorite, FavoriteBorder } from "@material-ui/icons";

export class Profile extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            profile: "",
            posts: []
        }

        this.findProfile = this.findProfile.bind(this);
        this.imageProfile = this.imageProfile.bind(this);
    }
    
    componentWillMount(){
        this.findProfile();
        this.findPosts();
        this.verifyLike();
    }

    verifyLike(){
        setTimeout(() => {
            for(let i of this.state.posts){
                fetch(global + "lik-verify/" + i.id, {
                    method: "GET",
                    headers: {
                        "x-access-token": sessionStorage.getItem("x-access-token")
                    }
                })
                .then(response => response.json())
                .then(like => {
                    this.setState(state => ({
                        ["like" + i.id]: like
                    }))
                })
            }
        }, 300)
    }

    findProfile(){
        fetch(global + "users/" + sessionStorage.getItem("userID"), {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(profile => {
            this.setState(state => ({
                profile
            }))
        })
        .catch(err => console.log(err));
    }
    
    findPosts(){
        fetch(global + "posts-user/" + sessionStorage.getItem("userID"), {
            method: "GET",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            }
        })
        .then(response => response.json())
        .then(posts => {
            this.setState(state => ({
                posts
            }));
        })
    }

    useStyles = (marginLeft, marginTop, width) => {
        return makeStyles({
            avatarProfile: {
                marginLeft,
                marginTop,
                width
            }
        })
    } 

    imageProfile(){
        var marginLeft = "-24px"
        var marginTop = "0px"
        var width = "110px"
        const position = this.state.profile.positionImage + "";

        if(parseInt(position.split(" ")[0] <= 0)){
            marginLeft = 0 + "px !important";
        } else {
            marginLeft = "-" + position.split(" ")[0] + "px !important";
        }
        marginTop = position.split(" ")[1] + "px !important";
        width = position.split(" ")[2] + "px !important";
        const styles = this.useStyles(marginLeft, marginTop, width);

        return <img src={this.state.profile.image} id="avatarRegister" className={styles().avatarProfile} />;
    }
    
    render(){
        const {profile, posts} = this.state;
        const ImageProfile = this.imageProfile
        var postsHTML = [];

        function likPost(id){
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
    
        function deleteLikPost(id){
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
        
        for(let i of posts){
            setTimeout(() => {
                var favorite = document.querySelector("#post"+ i.id +" .favorite");
                var favoriteBorder = document.querySelector("#post"+ i.id +" .favoriteBorder")
                console.log(this.state["like" + i.id])
                if(this.state["like" + i.id].lik){
                    favorite.style.display = "block";
                    favoriteBorder.style.display = "none";
                } else {
                    favorite.style.display = "none";
                    favoriteBorder.style.display = "block";
                }
            }, 400)
            var post = (
                <div className="postProfile" id={"post" + i.id}>
                    <img key={i.id} src={i.image} />
                    <div className="likesCount">
                        <Favorite onClick={() => deleteLikPost(i.id)} className="favorite" />
                        <FavoriteBorder onClick={() => likPost(i.id)} className="favoriteBorder" />
                        <p className="postNumberLikes">{i.likes}</p>
                    </div>
                    {i.description || i.description != "" && <p id="descriptionPostProfile">{i.description}</p>}
                </div>
            )

            postsHTML.push(post);
        }


        return (
            <div id="contentProfile">
                <div id="imageTitle">
                    <div id="contentAvatar" class="contentAvatarProfile">
                        <ImageProfile />
                    </div>
                    <div id="title__posts">
                        <h1 id="usernameProfile">{profile.username}</h1>
                        <p id="postsText">
                            <b>{posts.length}</b>
                            publicaciones
                        </p>
                    </div>
                </div>
                {profile.description && <p id="descriptionText">
                    {profile.description}
                </p>}
                <div id="posts">
                    {postsHTML}
                </div>
            </div>
            )
    }
}