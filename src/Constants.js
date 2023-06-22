export const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const VERTICAL_AXIS = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRID_SIZE = 100;

export function samePosition(position1, position2) {
    return position1.x === position2.x && position1.y === position2.y;
}

export const PieceType = {
    pawn: 0, 
    rook: 1,
    knight: 2,
    bishop: 3,
    queen: 4,
    king: 5
};

export const TeamType = {
    opponent: 0,
    player: 1
};




export const initialBoardPieces = [
    //Black Pieces
    {image: "/assets/images/rook_b.png", position: {x: 0, y: 7}, type: PieceType.rook, team: TeamType.opponent},
    {image: "/assets/images/knight_b.png", position: {x: 1, y: 7}, type: PieceType.knight, team: TeamType.opponent},
    {image: "/assets/images/bishop_b.png", position: {x: 2, y: 7}, type: PieceType.bishop, team: TeamType.opponent},
    {image: "/assets/images/queen_b.png", position: {x: 3, y: 7}, type: PieceType.queen, team: TeamType.opponent},
    {image: "/assets/images/king_b.png", position: {x: 4, y: 7}, type: PieceType.king, team: TeamType.opponent},
    {image: "/assets/images/bishop_b.png", position: {x: 5, y: 7}, type: PieceType.bishop, team: TeamType.opponent},
    {image: "/assets/images/knight_b.png", position: {x: 6, y: 7}, type: PieceType.knight, team: TeamType.opponent},
    {image: "/assets/images/rook_b.png", position: {x: 7, y: 7}, type: PieceType.rook, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 0, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 1, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 2, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 3, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 4, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 5, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 6, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    {image: "/assets/images/pawn_b.png", position: {x: 7, y: 6}, type: PieceType.pawn, team: TeamType.opponent},
    //White Pieces
    {image: "/assets/images/rook_w.png", position: {x: 0, y: 0}, type: PieceType.rook, team: TeamType.player},
    {image: "/assets/images/knight_w.png", position: {x: 1, y: 0}, type: PieceType.knight, team: TeamType.player},
    {image: "/assets/images/bishop_w.png", position: {x: 2, y: 0}, type: PieceType.bishop, team: TeamType.player},
    {image: "/assets/images/queen_w.png", position: {x: 3, y: 0}, type: PieceType.queen, team: TeamType.player},
    {image: "/assets/images/king_w.png", position: {x: 4, y: 0}, type: PieceType.king, team: TeamType.player},
    {image: "/assets/images/bishop_w.png", position: {x: 5, y: 4}, type: PieceType.bishop, team: TeamType.player},
    {image: "/assets/images/knight_w.png", position: {x: 6, y: 0}, type: PieceType.knight, team: TeamType.player},
    {image: "/assets/images/rook_w.png", position: {x: 7, y: 0}, type: PieceType.rook, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 0, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 1, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 2, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 3, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 4, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 5, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 6, y: 1}, type: PieceType.pawn, team: TeamType.player},
    {image: "/assets/images/pawn_w.png", position: {x: 7, y: 1}, type: PieceType.pawn, team: TeamType.player},
];