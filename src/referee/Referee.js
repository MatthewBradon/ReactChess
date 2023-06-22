
import {PieceType, TeamType, samePosition} from "../Constants";
import { pawnMove, knightMove, bishopMove, rookMove, queenMove, kingMove} from "./rules";


export default class Referee {



    isEnPassantMove(initialPosition, desiredPosition, pieceType, team, boardPieces){

        const direction = team === TeamType.player ? 1 : -1;
        
        if(pieceType === PieceType.pawn){

            //Checking if the piece moved left or right
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === direction){

                //Return true if the piece's enPassant flag is true and the piece is in the correct position
                return boardPieces.find((elem) => samePosition(elem.position, {x: desiredPosition.x, y: desiredPosition.y - direction}) && elem.enPassant) !== undefined;
            }
        }

        return false;
    }

    
    
    isValidMove(initialPosition, desiredPosition, pieceType, team, boardPieces){
        switch(pieceType){
            case PieceType.pawn:
                return pawnMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.knight:
                return knightMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.bishop:
                return bishopMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.rook:
                return rookMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.queen:
                return queenMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.king:
                return kingMove(initialPosition, desiredPosition, team, boardPieces);
            default:
                return false;
            
        }
    }
}
