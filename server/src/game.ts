import { Chessboard, ChessColor, ChessMatch, ChessMove, ChessMatchResult } from '../../client/src/shared-libs/chessEngine/ChessTypes';
import { UserProfile } from "../../client/src/shared-libs/UserProfile";
import { initBoard } from "../../client/src/shared-libs/chessEngine/boardInit";
import { boardAfterMove, getValidTeamMoves, inCheckMate, isValidMove } from "../../client/src/shared-libs/chessEngine/chessRules";



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

    

    constructor(room: string, whitePlayer: UserProfile | undefined = undefined, blackPlayer: UserProfile | undefined = undefined, board: Chessboard | undefined = undefined){
        this.room = room;
        this.whitePlayer = whitePlayer;
        this.blackPlayer = blackPlayer;
        this.spectators = [];
        this.gameStatus = GameStatus.GameStarting;
        this.matchResult = ChessMatchResult.Unfinished;
        this.pendingDrawRequest = {whitePlayer:false, blackPlayer:false};
        if(board) {
            this.board = board;
        } else {
            this.board = initBoard();
        }
    };

    

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
            console.log(`Game started:: Room:${this.room} white:${this.whitePlayer?.username} black:${this.blackPlayer?.username}`)
            return true;
        }
        return false;
    }

    public attemptMove(player: UserProfile, move: ChessMove): Chessboard | undefined{
        if(this.gameStatus !== GameStatus.GameRunning) return undefined;
        if(player.username === this.whitePlayer?.username || player.username === this.blackPlayer?.username){
            if(isValidMove(move)){
                this.board = boardAfterMove(move);
                //if white cant move
                if(this.board.turn === ChessColor.White && getValidTeamMoves(ChessColor.White, this.board).length < 1){
                    this.gameStatus = GameStatus.GameOver;
                    if(inCheckMate(ChessColor.White, this.board)){
                        this.matchResult = ChessMatchResult.BlackWins;
                    }else {
                        this.matchResult = ChessMatchResult.Stalemate;
                    }
                //if black cant move
                }else if(this.board.turn === ChessColor.Black && getValidTeamMoves(ChessColor.Black, this.board).length < 1){
                    this.gameStatus = GameStatus.GameOver;
                    if(inCheckMate(ChessColor.Black, this.board)){
                        this.matchResult = ChessMatchResult.WhiteWins;
                    }else {
                        this.matchResult = ChessMatchResult.Stalemate;
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
            this.gameStatus = GameStatus.GameOver;
            this.matchResult = ChessMatchResult.BlackWins;
            return true;
        }else if(player.username === this.blackPlayer?.username){
            this.gameStatus = GameStatus.GameOver;
            this.matchResult = ChessMatchResult.WhiteWins;
            return true;
        }
        return false;
    }

    public attemptDraw(player:UserProfile){
        if(this.gameStatus !== GameStatus.GameRunning)return false;
        if(player.username === this.whitePlayer?.username){
            this.pendingDrawRequest.whitePlayer = true;
            if(this.pendingDrawRequest.blackPlayer === true){
                this.gameStatus = GameStatus.GameOver;
                this.matchResult = ChessMatchResult.Draw;
                return true;
            }
        }else if(player.username === this.blackPlayer?.username){
            this.pendingDrawRequest.blackPlayer = true;
            if(this.pendingDrawRequest.whitePlayer === true){
                this.gameStatus = GameStatus.GameOver;
                this.matchResult = ChessMatchResult.Draw;
                return true;
            }
        }
        return false;
    }

    public getMatch():ChessMatch{
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

