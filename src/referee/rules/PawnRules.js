import { TeamType } from "../../Constants";
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