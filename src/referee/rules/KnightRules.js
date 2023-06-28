import { tileIsEmptyOrOccupiedByOpponent } from './GeneralRules';
import { Position } from '../../models';

export const knightMove = (initialPosition, desiredPosition, team, boardPieces) =>{
    const moveHorizontal = Math.abs(desiredPosition.x - initialPosition.x) === 2 && Math.abs(desiredPosition.y - initialPosition.y) === 1;
    const moveVertical = Math.abs(desiredPosition.x - initialPosition.x) === 1 && Math.abs(desiredPosition.y - initialPosition.y) === 2;
    
    if((moveVertical || moveHorizontal) && tileIsEmptyOrOccupiedByOpponent(desiredPosition, team, boardPieces)){
        return true;
    }
    return false;
}

export const getPossibleKnightMoves = (knight, boardPieces) => {
    const possibleMoves = [];
    for(let i = -1; i < 2; i += 2){
        for(let j = -1; j < 2; j += 2){
            const vertcialMove = new Position(knight.position.x + i, knight.position.y + 2 * j)
            const horizontalMove = new Position(knight.position.x + 2 * i, knight.position.y + j)

            if(tileIsEmptyOrOccupiedByOpponent(vertcialMove, knight.team, boardPieces)){
                possibleMoves.push(vertcialMove);
            }
            if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, knight.team, boardPieces)){
                possibleMoves.push(horizontalMove);
            }
        }
    }
    return possibleMoves;
}