import {Component} from "react";
import {ListPosts} from "./ListPosts";
import {ListLikesPosts} from "./ListLikesPosts";
import {Profile} from "./Profile";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

export class HomeAuth extends Component{

    render(){
        return (
            <Router>
                <Switch>
                    <Route path="/profile" children={<Profile />} />
                    <Route path="/">
                        <ListLikesPosts />
                    </Route>
                </Switch>
            </Router>
        )
    }
}