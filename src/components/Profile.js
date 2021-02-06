import {Component} from "react";
import {global} from "../assets/serverLink";
import "../assets/css/Profile.css";
import { makeStyles } from "@material-ui/core";
import { Favorite } from "@material-ui/icons";

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
        for(let i of posts){
            var post = (
                <div className="postProfile">
                    <img key={i.id} src={i.image} />
                    <div className="likesCount">
                        <Favorite className="favoriteProfile" />
                        <p>{i.likes}</p>
                    </div>
                </div>
            )

            postsHTML.push(post);
        }
        return (
            <div id="contentProfile">
                <div id="imageTitle">
                    <div id="contentAvatar">
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