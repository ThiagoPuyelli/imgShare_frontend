import {global} from "../../assets/serverLink";

export var verifyAuth =  () => {
    if(sessionStorage.getItem("x-access-token")){
        const auth = fetch(global + "auth", {
            method: "get",
            headers: {
                "x-access-token": sessionStorage.getItem("x-access-token")
            },
            cors: "no-cors"
        })
        .then(response => response.json())
        .then(resolve => {
            if(resolve.auth){
                return true 
            } else {
                return false
            }
        })
        .catch(err => console.log(err))

        if(auth){
            return true
        } else {
            return false
        }
        
    } else {
        return false;
    }
}