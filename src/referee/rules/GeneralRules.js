import { samePosition } from '../../Constants';

export const tileIsEmptyOrOccupiedByOpponent = (desiredPosition, team, boardPieces)  => {
    return !tileIsOccupied(desiredPosition, boardPieces) || tileIsOccupiedByOpponent(desiredPosition, team, boardPieces);
}

export const tileIsOccupied = (desiredPosition, boardPieces) => {
    return boardPieces.find(elem => samePosition(elem.position, desiredPosition)) !== undefined;
}

export const tileIsOccupiedByOpponent = (desiredPosition, team, boardPieces) => {
    return boardPieces.find(elem => samePosition(elem.position, desiredPosition) && elem.team !== team) !== undefined;
}