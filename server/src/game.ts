import { Chessboard, ChessColor, ChessMatch, ChessMove, ChessMatchResult } from '../../client/src/shared-libs/chessEngine/ChessTypes';
import { UserProfile } from "../../client/src/shared-libs/UserProfile";
import { initBoard } from "../../client/src/shared-libs/chessEngine/boardInit";
import { boardAfterMove, getValidTeamMoves, inCheckMate, isValidMove } from "../../client/src/shared-libs/chessEngine/chessRules";
import { UserModel } from '../models/users';



enum GameStatus {
    GameStarting,
    GameRunning,
    GameOver,
}

export class ChessGame{
    private room: string;
    private gameStatus: GameStatus;

    private whitePlayer: UserProfile | undefined;
    private blackPlayer: UserProfile | undefined;
    private spectators: UserProfile[];

    private board: Chessboard;
    private matchResult: ChessMatchResult;
    private timer: {lastTimePunch: number, white: number, black: number};


    private pendingDrawRequest: {
        whitePlayer: boolean;
        blackPlayer: boolean;
    }

    private gameIsReadyToStart(): boolean{
        if(this.gameStatus === GameStatus.GameStarting){
            if(this.whitePlayer && this.blackPlayer){
                return true;
            }
        }
        return false;
    }

    //add updating to database
    private endMatch(result: ChessMatchResult){
        if(result === ChessMatchResult.Unfinished) return false;

        if(this.gameStatus === GameStatus.GameRunning){
            this.gameStatus = GameStatus.GameOver;
            this.matchResult = result;
            if(this.whitePlayer){
                if(result === ChessMatchResult.WhiteWins){
                    UserModel.findOneAndUpdate({username:this.whitePlayer.username}, {$inc:{'chessStats.wins': 1 }}).exec();
                } else if(result === ChessMatchResult.Draw ){
                    UserModel.findOneAndUpdate({username:this.whitePlayer.username}, {$inc:{'chessStats.draws': 1}}).exec();

                } else if(result === ChessMatchResult.BlackWins ){
                    UserModel.findOneAndUpdate({username:this.whitePlayer.username}, {$inc:{'chessStats.losses': 1}}).exec();

                }
            }
            if(this.blackPlayer){
                if(result === ChessMatchResult.WhiteWins){
                    UserModel.findOneAndUpdate({username:this.blackPlayer.username}, {$inc:{'chessStats.losses': 1}}).exec();

                } else if(result === ChessMatchResult.Draw ){
                    UserModel.findOneAndUpdate({username:this.blackPlayer.username}, {$inc:{'chessStats.draws': 1}}).exec();
                } else if(result === ChessMatchResult.BlackWins ){
                    UserModel.findOneAndUpdate({username:this.blackPlayer.username}, {$inc:{'chessStats.wins': 1}}).exec();
                }
            }
            
            return true;
        }
        return false;
    }
    

    constructor(room: string, whitePlayer: UserProfile | undefined = undefined, blackPlayer: UserProfile | undefined = undefined, board: Chessboard | undefined = undefined){
        this.room = room;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.spectators = [];
        this.gameStatus = GameStatus.GameStarting;
        this.matchResult = ChessMatchResult.Unfinished;
        this.pendingDrawRequest = {whitePlayer:false, blackPlayer:false};
        this.timer = {lastTimePunch: -1,white: 5 * 60, black: 5 * 60};
        if(board) {
            this.board = board;
        } else {
            this.board = initBoard();
        }
    };

    public updateTimers(){
        if(this.gameStatus === GameStatus.GameRunning){
            const turn = this.board.turn;
            const currentTime = Date.now();
            const timeDiff = currentTime - this.timer.lastTimePunch;
            if(turn === ChessColor.White){
                this.timer.white = this.timer.white - Math.floor(timeDiff / 1000);
            }else {
                this.timer.black = this.timer.black - Math.floor(timeDiff / 1000)
            }
            if(this.timer.white <= 0){
                this.endMatch(ChessMatchResult.BlackWins);
            }else if(this.timer.black <= 0){
                this.endMatch(ChessMatchResult.WhiteWins);
            }
        }

    }

    public joinGame(player: UserProfile){
        if(!this.whitePlayer && this.gameStatus === GameStatus.GameStarting){
            this.whitePlayer = player;
        }else if(!this.blackPlayer && this.gameStatus === GameStatus.GameStarting){
            this.blackPlayer = player;
        } else {
            this.spectators.push(player);
        }
    }


    public startGame(): boolean{
        if(this.gameIsReadyToStart()){
            this.gameStatus = GameStatus.GameRunning;
            this.timer.lastTimePunch = Date.now();
            this.updateTimers();
            console.log(`Game started:: Room:${this.room} white:${this.whitePlayer?.username} black:${this.blackPlayer?.username}`)
            return true;
        }
        return false;
    }

    public attemptMove(player: UserProfile, move: ChessMove): Chessboard | undefined{
        if(this.gameStatus !== GameStatus.GameRunning) return undefined;
        if(player.username === this.whitePlayer?.username || player.username === this.blackPlayer?.username){
            if(isValidMove(move)){
                this.updateTimers();
                this.board = boardAfterMove(move);
                //if white cant move
                if(this.board.turn === ChessColor.White && getValidTeamMoves(ChessColor.White, this.board).length < 1){
                    if(inCheckMate(ChessColor.White, this.board)){
                        this.endMatch(ChessMatchResult.BlackWins);
                    }else {
                        this.endMatch(ChessMatchResult.Draw);
                    }
                //if black cant move
                }else if(this.board.turn === ChessColor.Black && getValidTeamMoves(ChessColor.Black, this.board).length < 1){
                    if(inCheckMate(ChessColor.Black, this.board)){
                        this.endMatch(ChessMatchResult.WhiteWins);
                    }else {
                        this.endMatch(ChessMatchResult.Draw);
                    }
                }
                return this.board;
            }
        }
        return undefined;
    }

    

    public attemptResign(player: UserProfile){
        if(this.gameStatus !== GameStatus.GameRunning)return false;
        if(player.username === this.whitePlayer?.username){
            this.endMatch(ChessMatchResult.BlackWins);
            return true;
        }else if(player.username === this.blackPlayer?.username){
            this.endMatch(ChessMatchResult.WhiteWins);
            return true;
        }
        return false;
    }

    public attemptDraw(player:UserProfile){
        if(this.gameStatus !== GameStatus.GameRunning)return false;
        if(player.username === this.whitePlayer?.username){
            this.pendingDrawRequest.whitePlayer = true;
            
        }else if(player.username === this.blackPlayer?.username){
            this.pendingDrawRequest.blackPlayer = true;
        }

        if(this.pendingDrawRequest.whitePlayer === true && this.pendingDrawRequest.blackPlayer === true){
            this.endMatch(ChessMatchResult.Draw);
            return true;
        }
        return false;
    }

    public getMatch():ChessMatch{
        this.updateTimers();
        return {
            whitePlayer: {
                username: this.whitePlayer ? this.whitePlayer.username : "",
                isComputer: false,
            },
            blackPlayer: {
                username: this.blackPlayer ? this.blackPlayer.username : "",
                isComputer: false,
            },
            board: this.board,
            timer: {white:this.timer.white,black:this.timer.black},
            result: this.matchResult,
        }
    }

    public getResult(): ChessMatchResult{
        return this.matchResult;
    }

    public getBoard():Chessboard{
        return this.board;
    }

    public getRoom(): string {
        return this.room;
    }

    public getWhitePlayer(): UserProfile | undefined{
        return this.whitePlayer;
    }
    
    public getBlackPlayer(): UserProfile | undefined{
        return this.blackPlayer;
    }

    public getPlayerColor(player: UserProfile): ChessColor | undefined{
        if(player.username === this.whitePlayer?.username){
            return ChessColor.White;
        }else if(player.username === this.blackPlayer?.username){
            return ChessColor.Black;
        }
        return undefined;
    }

    public isPlayerInGame(playerToFind: UserProfile): boolean{
        if(this.whitePlayer?.username === playerToFind.username)return true;
        else if(this.blackPlayer?.username === playerToFind.username)return true;
        else if(this.spectators.find((user)=>{user.username === playerToFind.username}))return true;
        return false;
    }

}

