import { tileIsEmptyOrOccupiedByOpponent } from './GeneralRules';

export const knightMove = (initialPosition, desiredPosition, team, boardPieces) =>{
    const moveHorizontal = Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1;
    const moveVertical = Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2;
    
    if((moveVertical || moveHorizontal) && tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces)){
        return true;
    }
    return false;
}