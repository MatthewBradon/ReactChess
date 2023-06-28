import { PieceType } from "../Types";
import { Piece } from "./Piece";


export class Pawn extends Piece {
    enPassant;
    possibleMoves;
    constructor(team, position, enPassant, possibleMoves = []){
        super(PieceType.pawn, team, position);
        this.enPassant = enPassant
        this.possibleMoves = possibleMoves;
        
    }

    clone(){
        return new Pawn(this.team, this.position.clone(), this.enPassant, this.possibleMoves?.map(move => move.clone()));
    }
}