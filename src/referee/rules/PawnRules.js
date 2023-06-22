import { PieceType, TeamType, samePosition} from "../../Constants";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";


export const pawnMove = (initialPosition, desiredPosition, team, boardPieces) => {
    const firstRow = (team === TeamType.player) ? 1 : 6;
    const direction = (team === TeamType.player) ? 1 : -1;
    //Initial 2 square move
    if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === 2 * direction && initialPosition.y === firstRow){
        if(!tileIsOccupied(desiredPosition, boardPieces) && !tileIsOccupied({x: desiredPosition.x, y: desiredPosition.y - direction}, boardPieces)){
            return true;
        }
    }//One square move
    else if(initialPosition.x === desiredPosition.x && desiredPosition.y - initialPosition.y === direction){
        if(!tileIsOccupied(desiredPosition, boardPieces)){
            return true;
        }
    }
    //Diagonal capture
    else if(Math.abs(desiredPosition.x - initialPosition.x) === 1 && desiredPosition.y - initialPosition.y === direction){
        if(tileIsOccupiedByOpponent(desiredPosition, team, boardPieces)){
            return true;
        }
    }
    return false;
}

export const getPossiblePawnMoves = (pawn, boardPieces) => {
    const possibleMoves = [];

    const firstRow = (pawn.team === TeamType.player) ? 1 : 6;
    const direction = (pawn.team === TeamType.player) ? 1 : -1;

    const normalMove = {x: pawn.position.x, y: pawn.position.y + direction};
    const specialMove = {x: pawn.position.x, y: pawn.position.y + 2 * direction};
    const leftCapture = {x: pawn.position.x - 1, y: pawn.position.y + direction};
    const rightCapture = {x: pawn.position.x + 1, y: pawn.position.y + direction};
    const leftPosition = {x: pawn.position.x - 1, y: pawn.position.y};
    const rightPosition = {x: pawn.position.x + 1, y: pawn.position.y};

    if(!tileIsOccupied(normalMove, boardPieces)){
        possibleMoves.push(normalMove);

        if(pawn.position.y === firstRow && !tileIsOccupied(specialMove, boardPieces)){
            possibleMoves.push(specialMove);
        }
    }
    if(tileIsOccupiedByOpponent(leftCapture, pawn.team, boardPieces)){
        possibleMoves.push(leftCapture);
    }
    else if(!tileIsOccupied(leftCapture, boardPieces)){
        const leftPiece = boardPieces.find((elem) => samePosition(elem.position, leftPosition));
        if(leftPiece !== null && leftPiece?.enPassant){
            possibleMoves.push(leftCapture);
        }
    }
    if(tileIsOccupiedByOpponent(rightCapture, pawn.team, boardPieces)){
        possibleMoves.push(rightCapture);
    } else if (!tileIsOccupied(rightCapture, boardPieces)){
        const rightPiece = boardPieces.find((elem) => samePosition(elem.position, rightPosition));
        if(rightPiece !== null && rightPiece?.enPassant){
            possibleMoves.push(rightCapture);
        }
    }
    
    return possibleMoves;
}