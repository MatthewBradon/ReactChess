import { PieceType, TeamType } from "../Types";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../referee/rules";
import { Position } from "./Position";

export class Board {
    pieces;

    constructor(pieces){
        this.pieces = pieces;

    }

    calculatePossibleMoves(){
        //Update the possible moves for each piece
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }
    }

    getValidMoves(piece, boardState){
        switch(piece.type){
            case PieceType.pawn:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.knight:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.bishop:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.rook:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.queen:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.king:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove, validMove, playedPiece, destination){
        const pawnDirection = playedPiece.team === TeamType.player ? 1 : -1;

        if(enPassantMove){
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    piece.enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    results.push(piece);
                }
                //Push every piece except the one that was attacked
                else if(!(piece.samePosition(new Position(destination.x, destination.y - pawnDirection)))){
                    if(piece.type === PieceType.pawn){
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }   
                return results;
            }, []);
            this.calculatePossibleMoves();
        }
        //Normal move
        else if(validMove){
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    //If the move is a pawn move of 2 squares, set en passant to true
                    piece.enPassant = Math.abs(piece.position.y - destination.y) === 2 && piece.isPawn;

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    

                    results.push(piece);
                }
                //Push every piece except the one that was attacked
                else if(!(piece.samePosition(destination))) {
                    if(piece.isPawn){
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }   
                return results;
            }, []);
            this.calculatePossibleMoves();
        }
        else {
            //If the move is not valid, return the piece to its original position
            return false;
        }
        return true;
    }

    clone(){
        return new Board(this.pieces.map(piece => piece.clone()));
    }
}