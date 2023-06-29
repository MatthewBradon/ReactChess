import { PieceType, TeamType } from './Types';
import {Piece, Position, Pawn, Board} from './models';

export const HORIZONTAL_AXIS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const VERTICAL_AXIS = [1, 2, 3, 4, 5, 6, 7, 8];

export const GRID_SIZE = 100;



export const initialBoard = new Board(
    [
        //Opponent Pieces
        new Piece(PieceType.rook, TeamType.opponent, new Position(0, 7)),
        new Piece(PieceType.knight, TeamType.opponent, new Position(1, 7)),
        new Piece(PieceType.bishop, TeamType.opponent, new Position(2, 7)),
        new Piece(PieceType.queen, TeamType.opponent, new Position(3, 7)),
        new Piece(PieceType.king, TeamType.opponent, new Position(4, 7)),
        new Piece(PieceType.bishop, TeamType.opponent, new Position(5, 7)),
        new Piece(PieceType.knight, TeamType.opponent, new Position(6, 7)),
        new Piece(PieceType.rook, TeamType.opponent, new Position(7, 7)),
        new Pawn(TeamType.opponent, new Position(0, 6)),
        new Pawn(TeamType.opponent, new Position(1, 6)),
        new Pawn(TeamType.opponent, new Position(2, 6)),
        new Pawn(TeamType.opponent, new Position(3, 6)),
        new Pawn(TeamType.opponent, new Position(4, 6)),
        new Pawn(TeamType.opponent, new Position(5, 6)),
        new Pawn(TeamType.opponent, new Position(6, 6)),
        new Pawn(TeamType.opponent, new Position(7, 6)),
        //Player Pieces
        new Piece(PieceType.rook, TeamType.player, new Position(0, 0)),
        new Piece(PieceType.knight, TeamType.player, new Position(1, 0)),
        new Piece(PieceType.bishop, TeamType.player, new Position(2, 0)),
        new Piece(PieceType.queen, TeamType.player, new Position(3, 0)),
        new Piece(PieceType.king, TeamType.player, new Position(4, 0)),
        new Piece(PieceType.bishop, TeamType.player, new Position(5, 0)),
        new Piece(PieceType.knight, TeamType.player, new Position(6, 0)),
        new Piece(PieceType.rook, TeamType.player, new Position(7, 0)),
        new Pawn(TeamType.player, new Position(0, 1)),
        new Pawn(TeamType.player, new Position(1, 1)),
        new Pawn(TeamType.player, new Position(2, 1)),
        new Pawn(TeamType.player, new Position(3, 1)),
        new Pawn(TeamType.player, new Position(4, 1)),
        new Pawn(TeamType.player, new Position(5, 1)),
        new Pawn(TeamType.player, new Position(6, 1)),
        new Pawn(TeamType.player, new Position(7, 1)),
    ], 1
);