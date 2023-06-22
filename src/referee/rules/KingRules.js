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