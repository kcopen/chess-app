import { Chessboard, ChessColor, ChessMove } from "../../client/src/shared-libs/chessEngine/ChessTypes";
import { UserProfile } from "../../client/src/shared-libs/UserProfile";
import { initBoard } from "../../client/src/shared-libs/chessEngine/boardInit";
import { boardAfterMove, isValidMove } from "../../client/src/shared-libs/chessEngine/chessRules";



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
        this.gameStatus = GameStatus.GameStarting
        
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
                return this.board;
            }
        }
        return undefined;
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

