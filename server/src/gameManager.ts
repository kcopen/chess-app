import { Chessboard, ChessColor, ChessMove } from "../../client/src/shared-libs/chessEngine/ChessTypes";
import { UserProfile } from "../../client/src/shared-libs/UserProfile";
import { ChessGame } from "./game";

export class GameManager{
    private activeGames: ChessGame[];
    private roomIncrementer: number;
    
    
    constructor(){
        this.activeGames = [];
        this.roomIncrementer = 1000;
        this.addGame();
    }

    public joinQueue(user: UserProfile): ChessGame{
        const nextGame: ChessGame = this.activeGames[this.activeGames.length - 1];
        nextGame.joinGame(user);
        if(nextGame.getWhitePlayer() && nextGame.getBlackPlayer()){
            nextGame.startGame();
            this.addGame();
        }
        return nextGame;
    }
   
    public getGame = (room: string): ChessGame | undefined =>{
        return this.activeGames.find(game=>game.getRoom() === room);
    }

    public addGame( whitePlayer: UserProfile | undefined = undefined, blackPlayer: UserProfile | undefined = undefined){
        this.activeGames.push(new ChessGame(this.roomIncrementer.toString(), whitePlayer, blackPlayer))
        this.roomIncrementer++;
    }

    public removeGame(room:string){
        this.activeGames = this.activeGames.filter((game)=>{
            return game.getRoom() !== room;
        })
    }

    //------
    
    public attemptMove(room:string, userProfile: UserProfile, move: ChessMove): Chessboard | undefined{
        const game = this.getGame(room);
        if(game){
            return game.attemptMove(userProfile, move);
        }
        return undefined;
    }

    public getBoard(room:string): Chessboard | undefined{
        return this.getGame(room)?.getBoard(); 
    }

    public joinGame(room: string, userProfile: UserProfile){
        const game = this.getGame(room);
        if(game){
            game.joinGame(userProfile);
        }
    }

    public startGame(room:string): boolean{
        const game = this.getGame(room);
        if(game){
            return game.startGame();
        }
        return false;
    }

    public getPlayerColor(room:string, userProfile: UserProfile): ChessColor | undefined{
        const game = this.getGame(room);
        if(game){
            return game.getPlayerColor(userProfile);
        }
        return undefined;
    }

    public getUserCurrentGame(userProfile: UserProfile): ChessGame | undefined {
        return this.activeGames.find(game=>(game.getBlackPlayer()?.username || game.getWhitePlayer()?.username) === userProfile.username)
    }    
}