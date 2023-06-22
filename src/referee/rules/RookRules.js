import { samePosition } from "../../Constants";
import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const rookMove = (initialPosition, desiredPosition, team, boardPieces) => {
    //Movement
    for(let i = 1; i < 8; i++){
        //Get direction
        let directionX = !(desiredPosition.y === initialPosition.y) ? 0 : (desiredPosition.x > initialPosition.x) ? 1 : -1;
        let directionY = !(desiredPosition.x === initialPosition.x) ? 0 : (desiredPosition.y > initialPosition.y) ? 1 : -1;
        let passedPosition = {x: initialPosition.x + (i * directionX), y: initialPosition.y + (i * directionY)};
        
        if(samePosition(passedPosition, desiredPosition)){
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