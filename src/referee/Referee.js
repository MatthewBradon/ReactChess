import { PieceType, TeamType } from "../components/Chessboard/Chessboard";


export default class Referee {

    tileIsOccupied(x, y, boardPieces){
        return boardPieces.find(elem => elem.x === x && elem.y === y) ? true : false;
    }

    tileIsOccupiedByOpponent(x, y, team, boardPieces){
        return boardPieces.find(elem => elem.x === x && elem.y === y && elem.team !== team) ? true : false;
    }

    isEnPassantMove(previousX, previousY, currentX, currentY, pieceType, team, boardPieces){

        const direction = team === TeamType.player ? 1 : -1;
        
        if(pieceType === PieceType.pawn){

            //Checking if the piece moved left or right
            if((currentX - previousX === -1 || currentX - previousX === 1) && currentY - previousY === direction){

                //Return true if the piece's enPassant flag is true and the piece is in the correct position
                return boardPieces.find((elem) => elem.x === currentX && elem.y === currentY - direction && elem.enPassant) ? true : false;
            }
        }

        return false;
    }

    isValidMove(previousX, previousY, currentX, currentY, pieceType, team, boardPieces){
        //console.log(`Previous X: ${previousX}, Previous Y: ${previousY}, Current X: ${currentX}, Current Y: ${currentY}, Piece Type: ${pieceType}, Team: ${team}`);

        if(pieceType === PieceType.pawn){
            const firstRow = (team === TeamType.player) ? 1 : 6;
            const direction = (team === TeamType.player) ? 1 : -1;
            
            if(previousX === currentX && currentY - previousY === 2 * direction && previousY === firstRow){
                if(!this.tileIsOccupied(currentX, currentY, boardPieces) && !this.tileIsOccupied(currentX, currentY - direction, boardPieces)){
                    return true;
                }
            }
            else if(previousX === currentX && currentY - previousY === direction){
                if(!this.tileIsOccupied(currentX, currentY, boardPieces)){
                    return true;
                }
            }
            //Diagonal capture
            else if(currentX - previousX === -1 && currentY - previousY === direction){
                if(this.tileIsOccupiedByOpponent(currentX, currentY, team, boardPieces)){
                    console.log("Diagonal capture");
                    return true;
                }
            }
            else if(currentX - previousX === 1 && currentY - previousY === direction){
                if(this.tileIsOccupiedByOpponent(currentX, currentY, team, boardPieces)){
                    console.log("Diagonal capture");
                    return true;
                }
            }
         }

        return false;
    }
}
