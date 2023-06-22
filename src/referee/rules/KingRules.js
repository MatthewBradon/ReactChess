import { samePosition } from "../../Constants";
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const kingMove = (initialPosition, desiredPosition, team, boardPieces) => {
    //Gets axis direction if its left -1 or right +1 or neither then 0 
    let directionX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
    let directionY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;
    let passedPosition = {x: initialPosition.x + directionX, y: initialPosition.y + directionY};
    
    if(samePosition(passedPosition, desiredPosition)){
        //Dealing with the destination tile
        if(tileIsEmptyOrOccupiedByOpponent(passedPosition, team, boardPieces)){
            return true;
        }
    }
    else {
        //If the passed tile is occupied by a piece, break out of the loop
        if(tileIsOccupied(passedPosition, boardPieces)){
            return false;
        }
    }
    return false;
}

export const getPossibleKingMoves = (king, boardPieces) => {
    const possibleMoves = [];
    //Check all 4 diagonal directions
    for(let i = -1; i < 2; i++){
        for(let j = -1; j < 2; j++){
            const destination = {x: king.position.x + i, y: king.position.y + j};

            if(!tileIsOccupied(destination, boardPieces)){
                possibleMoves.push(destination);
            }
            else if (tileIsEmptyOrOccupiedByOpponent(destination, king.team, boardPieces)){
                possibleMoves.push(destination);
            }
        }
    }
    return possibleMoves;
}