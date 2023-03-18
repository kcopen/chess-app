import { UserProfile } from '../../client/src/shared-libs/UserProfile';

export default class LoginManager{
    onlineUsers: Map<string, UserProfile>;
    constructor(){
        this.onlineUsers = new Map<string, UserProfile>();
    }

    //returns true if successful connection
    connectUser(user: UserProfile): boolean{
        
        if(this.onlineUsers.has(user.username)){
            //user already online
            return false;
        }
        this.onlineUsers.set(user.username, user);
        return true;
    }

    //returns true if successful disconnection
    disconnectUser(user:UserProfile): boolean{
        return this.onlineUsers.delete(user.username)
    }

    printAllOnlineUsers(){
        let printString = "Online Users:";
        this.onlineUsers.forEach((u)=>{printString.concat(u.username)});
        console.log(printString);
    }
}