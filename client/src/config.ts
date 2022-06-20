export const GRID_SIZE = 8; //8x8 chessboard

export const BOARD_SIZE = ()=>{
    const board = document.querySelector(".chessboard");
    if(board){
        return board.clientWidth;
    }
    return 800;
};
export const HIGHLIGHTED_BORDER_SIZE = 3;

export const SQUARE_SIZE = BOARD_SIZE() / GRID_SIZE;


export const PIECE_SIZE = ()=>{
    const piece = document.querySelector(".chess-piece");
    if(piece){
        return piece.clientWidth;
    }
    return 100;
};

export const BLACK_SQUARE_COLOR = "#556b2f";
export const WHITE_SQUARE_COLOR = "#ffffe0";
