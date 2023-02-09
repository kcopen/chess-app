import { UserProfile } from '../../client/src/shared-libs/UserProfile';

export default class LoginManager{
    onlineUsers: UserProfile[];
    constructor(){
        this.onlineUsers = [];
    }

    connectUser(user: UserProfile): boolean{
        
        if(this.onlineUsers.filter(u=>u.username === user.username).length > 0){
            //user already online
            return false;
        }
        this.onlineUsers.push(user);
        return true;
    }

    disconnectUser(user:UserProfile): boolean{
        if(this.onlineUsers.length < 1) return false;
        if(this.onlineUsers.splice(this.onlineUsers.indexOf(user), 1).length > 0)return true;
        return false;
    }

    printAllOnlineUsers(){
        let printString = "Online Users:";
        this.onlineUsers.forEach((u)=>{printString.concat(u.username)});
        console.log(printString);
    }
}