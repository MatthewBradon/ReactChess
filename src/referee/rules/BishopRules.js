import { samePosition } from '../../Constants';
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied} from './GeneralRules';

export const bishopMove = (initialPosition, desiredPosition, team, boardPieces) => {
    for(let i = 1; i < 8; i++){
        //Get diagonal direction based on desired relative to initial
        let directionX = (desiredPosition.x > initialPosition.x) ? 1 : -1;
        let directionY = (desiredPosition.y > initialPosition.y) ? 1 : -1;
        //Get the next tile to check
        let passedPosition = {x: initialPosition.x + i * directionX, y: initialPosition.y + i * directionY};

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
    
}