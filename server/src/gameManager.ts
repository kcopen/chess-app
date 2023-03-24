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
    public quick_match(user: UserProfile): ChessGame | undefined{
        if(!user || !user.username) return undefined;
        this.quickMatchQueue.push(user);
        //TODO add check to make sure ratings are similar
        if(this.quickMatchQueue.length >= 2){
            const whitePlayer = this.quickMatchQueue.shift();
            const blackPlayer = this.quickMatchQueue.shift();
            if(!whitePlayer || !blackPlayer)
                return undefined;
            
                const roomName: string  = `QM ${whitePlayer.username} vs ${blackPlayer.username}`;
            if(this.quickMatchGames.has(roomName))
                return undefined;
            const nextGame: ChessGame = new ChessGame(roomName, whitePlayer, blackPlayer);
            this.quickMatchGames.set(roomName, nextGame);
            return nextGame;
        }
        return undefined;
    }
//TODO
    public rated_match(user: UserProfile): ChessGame | undefined{
        return undefined;
    }

    //TODO
    public host_private_match(user: UserProfile): ChessGame | undefined{
        return undefined;
    }

    //TODO
    public join_private_match(user: UserProfile): ChessGame | undefined{
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

    public removeGame(room:string){
        if(room.startsWith("QM"))//quick match
            this.quickMatchGames.delete(room)
        else if(room.startsWith("RM"))//rated match
            this.ratedMatchGames.delete(room)
        else if(room.startsWith("PM"))//private match
            this.privateMatchGames.delete(room)
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