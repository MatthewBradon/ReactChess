import { PieceType } from "../Types";
import { Piece } from "./Piece";


export class Pawn extends Piece {
    enPassant;
    constructor(team, position, hasMoved, enPassant, possibleMoves = []){
        super(PieceType.pawn, team, position, hasMoved);
        this.enPassant = enPassant
        this.possibleMoves = possibleMoves;
        
    }

    clone(){
        return new Pawn(this.team, this.position.clone(), this.hasMoved, this.enPassant, this.possibleMoves?.map(move => move.clone()));
    }
}