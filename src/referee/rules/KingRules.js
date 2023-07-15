import { tileIsOccupied, tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";
import { Position } from "../../models";

export const kingMove = (initialPosition, desiredPosition, team, boardPieces) => {
    //Gets axis direction if its left -1 or right +1 or neither then 0 
    let directionX = (desiredPosition.x < initialPosition.x) ? -1 : (desiredPosition.x > initialPosition.x) ? 1 : 0;
    let directionY = (desiredPosition.y < initialPosition.y) ? -1 : (desiredPosition.y > initialPosition.y) ? 1 : 0;
    let passedPosition = new Position(initialPosition.x + directionX, initialPosition.y + directionY);
    
    if(passedPosition.samePosition(desiredPosition)){
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
            const destination = new Position(king.position.x + i, king.position.y + j);
            if(!tileIsOccupied(destination, boardPieces)){
                possibleMoves.push(destination);
            }
            else if (tileIsEmptyOrOccupiedByOpponent(destination, king.team, boardPieces)){
                possibleMoves.push(destination);
            }
        }
    }
    return possibleMoves.filter(move => move.x <= 7 && move.x >= 0 && move.y <= 7 && move.y >= 0);
}

export const getCastlingMoves = (king, boardPieces) => {
    const possibleMoves = [];
    //Check if king has moved
    if(king.hasMoved) return possibleMoves;
    //Get the same team rooks that hasnt moved
    const rooks = boardPieces.filter(piece => piece.isRook && piece.team === king.team && !piece.hasMoved);

    for(const rook of rooks){
        const direction = rook.position.x > king.position.x ? 1 : -1;
        const adjacentPosition = king.position.clone();
        adjacentPosition.x += direction;


        //If the rook cant move up to the kings adjacent position, skip this rook
        if(!rook.possibleMoves?.some(move => move.samePosition(adjacentPosition))){
            console.log("Rook cant move up to the kings adjacent position");
            continue;
        }

        const concerningTiles = rook.possibleMoves.filter(move => move.y === king.position.y);
        
        //Checks if enemy peices are attacking concerning tiles
        const enemyPieces = boardPieces.filter(piece => piece.team !== king.team);
        console.log(enemyPieces);
        
        if(enemyPieces.some(piece => piece.possibleMoves?.some(move => concerningTiles.some(tile => tile.samePosition(move))))){
            console.log("Enemy pieces are attacking concerning tiles");
            continue;
        }

        //Add the castling move
        console.log("Castling move added");
        possibleMoves.push(rook.position.clone());
    
    }


    return possibleMoves;
}