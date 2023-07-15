import { Position } from "../../models";
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const queenMove = (initialPosition, desiredPosition, team, boardPieces) => {
    for(let i = 1; i < 8; i++){
        //Gets axis direction if its left -1 or right +1 or neither then 0 
        let multiplerX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
        let multiplerY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;
        let passedPosition = new Position(initialPosition.x + (i * multiplerX), initialPosition.y + (i * multiplerY))
        
        if(passedPosition.samePosition(desiredPosition)){
            //Dealing with the destination tile
            if(tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
                return true;
            }
        }
        else {
            //If the passed tile is occupied by a piece, break out of the loop
            if(tileIsOccupied(passedPosition, boardPieces)){
                break;
            }
        }
    }
    return false;
}

export const getPossibleQueenMoves = (queen, boardPieces) => {
    const possibleMoves = [];
    //Check all 4 diagonal directions
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x + i, queen.position.y + i);

        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x - i, queen.position.y + i);
        
        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        
        const destination = new Position(queen.position.x + i, queen.position.y - i);

        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x - i, queen.position.y - i);

        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    //Check all 4 straight directions
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x + i, queen.position.y);
        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x - i, queen.position.y);
        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x, queen.position.y + i);
        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    for(let i = 1; i < 8; i++){
        const destination = new Position(queen.position.x, queen.position.y - i);
        if(!tileIsOccupied(destination, boardPieces)){
            possibleMoves.push(destination);
        }
        else if (tileIsEmptyOrOccupiedByOpponent(destination, queen.team, boardPieces)){
            possibleMoves.push(destination);
            break;
        }
        else {
            break;
        }
    }
    return possibleMoves.filter(move => move.x <= 7 && move.x >= 0 && move.y <= 7 && move.y >= 0);
}