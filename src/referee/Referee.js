
import {PieceType, TeamType, samePosition} from "../Constants";

export default class Referee {

    tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces){
        return !this.tileIsOccupied(desiredPosition, boardPieces) || this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces);
    }

    tileIsOccupied(desiredPosition, boardPieces){
        return boardPieces.find(elem => samePosition(elem.position, desiredPosition)) !== undefined;
    }

    tileIsOccupiedByOpponent(desiredPosition, team, boardPieces){
        return boardPieces.find(elem => samePosition(elem.position, desiredPosition) && elem.team !== team) !== undefined;
    }

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

    pawnMove(initialPosition, desiredPosition, team, boardPieces){
        const firstRow = (team === TeamType.player) ? 1 : 6;
        const direction = (team === TeamType.player) ? 1 : -1;
        //Initial 2 square move
        if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === 2 * direction && initialPosition.y === firstRow){
            if(!this.tileIsOccupied(desiredPosition, boardPieces) && !this.tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - direction}, boardPieces)){
                return true;
            }
        }//One square move
        else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === direction){
            if(!this.tileIsOccupied(desiredPosition, boardPieces)){
                return true;
            }
        }
        //Diagonal capture
        else if(desiredPosition.x - initialPosition.x === -1 && desiredPosition.y - initialPosition.y === direction){
            if(this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces)){
                return true;
            }
        }
        else if(desiredPosition.x - initialPosition.x === 1 && desiredPosition.y - initialPosition.y === direction){
            if(this.tileIsOccupiedByOpponent(desiredPosition, team, boardPieces)){
                return true;
            }
        }
        return false;
    }

    knightMove(initialPosition, desiredPosition, team, boardPieces){
        const moveHorizontal = Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1;
        const moveVertical = Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2;
        
        if((moveVertical || moveHorizontal) && this.tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces)){
            return true;
        }
        return false;
    }
    bishopMove(initialPosition, desiredPosition, team, boardPieces){
        for(let i = 1; i < 8; i++){
            //Get diagonal direction based on desired relative to initial
            let directionX = (desiredPosition.x > initialPosition.x) ? 1 : -1;
            let directionY = (desiredPosition.y > initialPosition.y) ? 1 : -1;
            //Get the next tile to check
            let passedPosition = {x: initialPosition.x + i * directionX, y: initialPosition.y + i * directionY};

            if(samePosition(passedPosition, desiredPosition)){
                //Dealing with the destination tile
                if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                    return true;
                }
            }
            else {
                //If the passed tile is occupied by a piece, break out of the loop
                if(this.tileIsOccupied(passedPosition, boardPieces)){
                    break;
                }
            }
        }
        
    }
    rookMove(initialPosition, desiredPosition, team, boardPieces){
        //Vertical movement
        if(initialPosition.x === desiredPosition.x){
            for(let i = 1; i < 8; i++){
                //Get vertical direction based on desired relative to initial
                let direction = desiredPosition.y < initialPosition.y ? -1 : 1;
                let passedPosition = {x: initialPosition.x, y: initialPosition.y + (i * direction)};
                if(samePosition(passedPosition, desiredPosition)){
                    //Dealing with the destination tile
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                        return true;
                    }
                }
                else {
                    //If the passed tile is occupied by a piece, break out of the loop
                    if(this.tileIsOccupied(passedPosition, boardPieces)){
                        break;
                    }
                }
            } 
        }
        //Horizontal movement
        else if(initialPosition.y === desiredPosition.y){
            for(let i = 1; i < 8; i++){
                let direction = desiredPosition.x < initialPosition.x ? -1 : 1;
                let passedPosition = {x: initialPosition.x + (i * direction), y: initialPosition.y};
                if(samePosition(passedPosition, desiredPosition)){
                    //Dealing with the destination tile
                    if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                        return true;
                    }
                }
                else {
                    //If the passed tile is occupied by a piece, break out of the loop
                    if(this.tileIsOccupied(passedPosition, boardPieces)){
                        break;
                    }
                }
            }
        }
        return false;
    }
    queenMove(initialPosition, desiredPosition, team, boardPieces){
        for(let i = 1; i < 8; i++){
            let multiplerX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
            let multiplerY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;
            let passedPosition = {x: initialPosition.x + (i * multiplerX), y: initialPosition.y + (i * multiplerY)};
            
            if(samePosition(passedPosition, desiredPosition)){
                //Dealing with the destination tile
                if(this.tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                    return true;
                }
            }
            else {
                //If the passed tile is occupied by a piece, break out of the loop
                if(this.tileIsOccupied(passedPosition, boardPieces)){
                    break;
                }
            }
        }
        return false;
    }
    isValidMove(initialPosition, desiredPosition, pieceType, team, boardPieces){
        switch(pieceType){
            case PieceType.pawn:
                return this.pawnMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.knight:
                return this.knightMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.bishop:
                return this.bishopMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.rook:
                return this.rookMove(initialPosition, desiredPosition, team, boardPieces);
            case PieceType.queen:
                return this.queenMove(initialPosition, desiredPosition, team, boardPieces);
            default:
                return false;
            
        }
    }
}
