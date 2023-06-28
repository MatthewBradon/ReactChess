

export const tileIsEmptyOrOccupiedByOpponent = (desiredPosition, team, boardPieces)  => {
    return !tileIsOccupied(desiredPosition, boardPieces) || tileIsOccupiedByOpponent(desiredPosition, team, boardPieces);
}

export const tileIsOccupied = (desiredPosition, boardPieces) => {
    return boardPieces.find(elem => elem.samePosition(desiredPosition)) !== undefined;
}

export const tileIsOccupiedByOpponent = (desiredPosition, team, boardPieces) => {
    return boardPieces.find(elem => elem.samePosition(desiredPosition) && elem.team !== team) !== undefined;
}