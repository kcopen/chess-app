import { Chessboard, ChessColor, ChessMove } from "../../client/src/shared-libs/chessEngine/ChessTypes";
import { UserProfile } from "../../client/src/shared-libs/UserProfile";
import { ChessGame } from "./game";

export class GameManager{
    private quickMatchGames: Map<string, ChessGame>; //Map<room, game>
    private quickMatchQueue: UserProfile[];

    private ratedMatchGames: Map<string, ChessGame>; //Map<room, game>
    private ratedMatchQueue: UserProfile[];

    private privateMatchGames: Map<string, ChessGame>; //Map<room, game>
    
    constructor(){
        this.quickMatchGames = new Map<string, ChessGame>;
        this.quickMatchQueue = [];

        this.ratedMatchGames = new Map<string, ChessGame>;
        this.ratedMatchQueue = [];

        this.privateMatchGames = new Map<string, ChessGame>;
    }

    //returns the game if one is created otherwise adds the player to queue and returns undefined
    public joinQuickMatch(user: UserProfile): ChessGame | undefined{
        this.quickMatchQueue.push(user);
        //if the queue contains more than 2 people check to see if a game can be started
        if(this.quickMatchQueue.length >= 2){
            const whitePlayer = this.quickMatchQueue.shift();
            const blackPlayer = this.quickMatchQueue.shift();
            if(!whitePlayer || !blackPlayer)
                return undefined;
            
            const roomName: string  = `QM ${whitePlayer.username} vs ${blackPlayer.username}`;
            const nextGame: ChessGame = new ChessGame(roomName, whitePlayer, blackPlayer);
            this.quickMatchGames.set(roomName, nextGame);
            return nextGame;
        }
        return undefined;
    }

    public joinRatedMatch(user: UserProfile): ChessGame | undefined{
        const maximumRatingDifference = 150; //max rating difference between players to start a game
        
        //add the user to the rated match queue and sort the queue by rating, if a player is not yet rated
        this.ratedMatchQueue.push(user);
        const defaultRating = 500;
        this.ratedMatchQueue.sort((a:UserProfile,b:UserProfile)=>{
            if(a.chessStats && b.chessStats) return a.chessStats.rating - b.chessStats.rating;
            else if(!a.chessStats && b.chessStats)return defaultRating - b.chessStats.rating;
            else if(a.chessStats && !b.chessStats) return a.chessStats.rating - defaultRating;
            else return 0;
        })
        //if the queue contains more than 2 people check to ssee if a game can be started
        if(this.ratedMatchQueue.length >= 2){
            const userIndex = this.ratedMatchQueue.findIndex((u)=>u.username === user.username);
            
            const userRating: number = user.chessStats ? user.chessStats.rating : defaultRating;
            //find which opponent is closest in rating to the user
            let opponentBelow: UserProfile | undefined = undefined;
            let opponentBelowDiff: number = maximumRatingDifference + 1;

            let opponentAbove: UserProfile | undefined = undefined;
            let opponentAboveDiff: number = maximumRatingDifference + 1;

            let closestOpponent: UserProfile | undefined = undefined;

            if(this.ratedMatchQueue.length > userIndex + 1) {
                opponentAbove = this.ratedMatchQueue[userIndex + 1];
                const opponentAboveRating = opponentAbove?.chessStats ? opponentAbove.chessStats.rating : defaultRating;
                opponentAboveDiff = Math.abs(opponentAboveRating - userRating);
            }
            if(0 <= userIndex - 1) {
                opponentBelow = this.ratedMatchQueue[userIndex - 1];
                const opponentBelowRating = opponentBelow?.chessStats ? opponentBelow.chessStats.rating : defaultRating;
                opponentBelowDiff = Math.abs(opponentBelowRating - userRating);
            }

            if(!opponentAbove && opponentBelow) closestOpponent = opponentBelow;
            else if(opponentAbove && !opponentBelow) closestOpponent = opponentAbove;  
            else if(opponentAbove && opponentBelow){
                if(opponentAboveDiff <= opponentBelowDiff)closestOpponent = opponentAbove;
                else closestOpponent = opponentBelow;
            }
            if(!closestOpponent)return undefined;
            //now that the closest opponent has been found check to see if their rating is within range and start the game if so
            if(closestOpponent.chessStats && user.chessStats && Math.abs(closestOpponent.chessStats.rating - user.chessStats.rating) < maximumRatingDifference){
                this.ratedMatchQueue = this.ratedMatchQueue.filter(u=>{
                    if(!closestOpponent)return true;
                    if(u.username === user.username || u.username === closestOpponent.username) return false;
                    else return true;
                });
                let whitePlayer: UserProfile = user;
                let blackPlayer: UserProfile = user;

                if(Math.random() > .5) blackPlayer = closestOpponent;
                else whitePlayer = closestOpponent;
                
                const roomName: string  = `RM ${whitePlayer.username} vs ${blackPlayer.username}`;
                const nextGame: ChessGame = new ChessGame(roomName, whitePlayer, blackPlayer);
                this.ratedMatchGames.set(roomName, nextGame);
                return nextGame;
            }
        }
        return undefined;
    }

    public hostPrivateMatch(user: UserProfile, roomName: string, roomPassword: string = ""): ChessGame | undefined{
        if(this.privateMatchGames.has(roomName)) return undefined;
       
        let hostedGame = new ChessGame(roomName, undefined, undefined, undefined, roomPassword);
        Math.random() < 0.5 ? hostedGame.joinGame(user,ChessColor.White) : hostedGame.joinGame(user,ChessColor.Black);
        this.privateMatchGames.set(roomName, hostedGame);

        return hostedGame;
    }

    //TODO
    public joinPrivateMatch(user: UserProfile, roomName: string, roomPassword: string = ""): ChessGame | undefined{
       return undefined;
    }
   
    public getGame = (room: string): ChessGame | undefined =>{
        let game: ChessGame | undefined = undefined;
        if(room.startsWith("QM"))//quick match
            game = this.quickMatchGames.get(room)
        else if(room.startsWith("RM"))//rated match
            game = this.ratedMatchGames.get(room)
        else if(room.startsWith("PM"))//private match
            game = this.privateMatchGames.get(room)
        
        return game;
    }

    public removeGame(room:string):boolean{
        console.log("room:" + room + " has been removed")
        return  (this.quickMatchGames.delete(room) || 
                this.ratedMatchGames.delete(room) || 
                this.privateMatchGames.delete(room));
    }

    //------
    
    public attemptMove(room:string, userProfile: UserProfile, move: ChessMove): Chessboard | undefined{
        const game = this.getGame(room);
        if(game) return game.attemptMove(userProfile, move);
        return undefined;
    }

    public getBoard(room:string): Chessboard | undefined{
        return this.getGame(room)?.getBoard();
    }

    public joinGame(room: string, userProfile: UserProfile){
        const game = this.getGame(room);
        if(game) game.joinGame(userProfile);

    }

    public startGame(room:string): boolean{
        const game = this.getGame(room);
        if(game) return game.startGame();
        return false;
    }

    public getPlayerColor(room:string, userProfile: UserProfile): ChessColor | undefined{
       const game = this.getGame(room);
       if(game) return game.getPlayerColor(userProfile);
       return undefined;
    }

    public getUserCurrentGame(userProfile: UserProfile): ChessGame | undefined {
        let game: ChessGame | undefined = undefined;
        function setGame(g: ChessGame){
            if(g.getBlackPlayer()?.username === userProfile.username)game = g;
            else if(g.getWhitePlayer()?.username === userProfile.username)game = g;

        }
        this.quickMatchGames.forEach(setGame)
        this.ratedMatchGames.forEach(setGame)
        this.privateMatchGames.forEach(setGame)
        return game;
    }    
}