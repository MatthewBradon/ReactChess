import { PieceType, TeamType } from "../Types";
import { getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves } from "../referee/rules";
import { Position } from "./Position";

export class Board {
    pieces;
    totalTurns;
    constructor(pieces, totalTurns){
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    calculatePossibleMoves(){
        //Update the possible moves for each piece
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }

        this.checkKingMoves();
    }

    checkKingMoves(){
        const king = this.pieces.find(piece => piece.isKing && piece.team === TeamType.opponent);

        if(king?.possibleMoves === undefined) return;

        //Simulate King moves
        for (const move of king.possibleMoves) {
            const simulatedBoard = this.clone();
            const pieceAtDestination = simulatedBoard.pieces.find(piece => piece.samePosition(move));

            if(pieceAtDestination !== undefined){
                simulatedBoard.pieces = simulatedBoard.pieces.filter(piece => !piece.samePosition(move));
            }

            const simulatedKing = simulatedBoard.pieces.find(piece => piece.isKing && piece.team === TeamType.opponent);
            
            //if(simulatedKing === undefined) continue;
            
            simulatedKing.position = move;
        
            for(const enemy of simulatedBoard.pieces.filter(piece => piece.team === TeamType.player)){
                enemy.possibleMoves = this.getValidMoves(enemy, simulatedBoard.pieces);
            }

            let safe = true;
            //Check if move is safe
            for(const piece of simulatedBoard.pieces){
               
                    if(piece.team === TeamType.opponent) continue;
                    if(piece.isPawn){
                        const possiblePawnMoves = this.getValidMoves(piece, simulatedBoard.pieces);
                        if(possiblePawnMoves?.some(pawn => pawn.x !== piece.position.x&& pawn.samePosition(move))){
                            safe = false;
                            break;
                        }
                    }else if(piece.possibleMoves?.some(piece => piece.samePosition(move))){
                        safe = false;
                        break;
                    }
            }
            if(!safe){
                //Remove the move from the possible moves
                king.possibleMoves = king.possibleMoves?.filter(kingMove => !kingMove.samePosition(move));
            }
        }
    }


    getValidMoves(piece, boardState){
        switch(piece.type){
            case PieceType.pawn:
                return getPossiblePawnMoves(piece, boardState);
            case PieceType.knight:
                return getPossibleKnightMoves(piece, boardState);
            case PieceType.bishop:
                return getPossibleBishopMoves(piece, boardState);
            case PieceType.rook:
                return getPossibleRookMoves(piece, boardState);
            case PieceType.queen:
                return getPossibleQueenMoves(piece, boardState);
            case PieceType.king:
                return getPossibleKingMoves(piece, boardState);
            default:
                return [];
        }
    }

    playMove(enPassantMove, validMove, playedPiece, destination){
        const pawnDirection = playedPiece.team === TeamType.player ? 1 : -1;

        if(enPassantMove){
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    piece.enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    results.push(piece);
                }
                //Push every piece except the one that was attacked
                else if(!(piece.samePosition(new Position(destination.x, destination.y - pawnDirection)))){
                    if(piece.type === PieceType.pawn){
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }   
                return results;
            }, []);
            this.calculatePossibleMoves();
        }
        //Normal move
        else if(validMove){
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)){
                    //If the move is a pawn move of 2 squares, set en passant to true
                    piece.enPassant = Math.abs(piece.position.y - destination.y) === 2 && piece.isPawn;

                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    

                    results.push(piece);
                }
                //Push every piece except the one that was attacked
                else if(!(piece.samePosition(destination))) {
                    if(piece.isPawn){
                        piece.enPassant = false;
                    }
                    results.push(piece);
                }   
                return results;
            }, []);
            this.calculatePossibleMoves();
        }
        else {
            //If the move is not valid, return the piece to its original position
            return false;
        }
        return true;
    }

    clone(){
        return new Board(this.pieces.map(piece => piece.clone()), this.totalTurns);
    }
}