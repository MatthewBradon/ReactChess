import { PieceType } from "../Types";

export class Piece {
    image;
    type;
    team;
    position;
    possibleMoves;
    hasMoved;
    constructor(type, team, position,  hasMoved, possibleMoves = []){
        this.type = type;
        this.team = team;
        this.position = position;
        this.image = `assets/images/${type}_${team}.png`
        this.possibleMoves = possibleMoves;
        this.hasMoved = hasMoved;
    }

    get isPawn(){
        return this.type === PieceType.pawn;
    }

    get isRook(){
        return this.type === PieceType.rook;
    }

    get isKnight(){
        return this.type === PieceType.knight;
    }
    
    get isBishop(){
        return this.type === PieceType.bishop;
    }

    get isQueen(){
        return this.type === PieceType.queen;
    }

    get isKing(){
        return this.type === PieceType.king;
    }

    samePosition(otherPosition){
        return this.position.samePosition(otherPosition);
    }

    samePiecePosition(otherPiece){
        return this.position.samePosition(otherPiece.position);
    }

    clone(){
        return new Piece(this.type, this.team, this.position.clone(), this.hasMoved ,this.possibleMoves?.map(move => move.clone()));
    }
}