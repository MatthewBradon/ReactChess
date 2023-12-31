import { PieceType, TeamType } from "../Types";
import { getCastlingMoves, getPossibleBishopMoves, getPossibleKingMoves, getPossibleKnightMoves, getPossiblePawnMoves, getPossibleQueenMoves, getPossibleRookMoves, inCheck } from "../referee/rules";
import { Position } from "./Position";

export class Board {
    pieces;
    totalTurns;
    winningTeam;
    constructor(pieces, totalTurns){
        this.pieces = pieces;
        this.totalTurns = totalTurns;
    }

    calculatePossibleMoves(){
        //Update the possible moves for each piece
        for(const piece of this.pieces){
            piece.possibleMoves = this.getValidMoves(piece, this.pieces);
        }
        //Check castling
        for(const king of this.pieces.filter(p => p.isKing)){
            if(king.possibleMoves === undefined) continue;
            king.possibleMoves = [...king.possibleMoves, ...getCastlingMoves(king, this.pieces)];
        }
        //Check if current team moves are valid
        this.checkCurrentTeamMoves();

        //Copy the board to all pieces to check for checkmate and stalemate
        const allPieces = this.pieces.map(piece => piece.clone());

        //Remove possible moves for team that is not playing
        this.pieces.filter(piece => piece.team !== this.currentTeam).forEach(piece => piece.possibleMoves = []);
    

        //Check if the current team has moves
        if(this.pieces.filter(piece => piece.team === this.currentTeam).some(piece => piece.possibleMoves !== undefined && piece.possibleMoves.length > 0)) return;

        //Check if the current team is in check
        
        if(this.pieces.filter(piece => piece.isKing && inCheck(piece, allPieces)).length > 0){
            console.log("Checkmate");
            this.winningTeam = this.currentTeam === TeamType.player ? TeamType.opponent : TeamType.player;
        }
        else{
            this.winningTeam = "draw";
        }
    }

    get currentTeam(){
        let currentTurn = this.totalTurns % 2;
        if(TeamType.player === "w" && currentTurn === 1) return TeamType.player;
        if(TeamType.player === "b" && currentTurn === 0) return TeamType.player;
        return TeamType.opponent;
    }

    checkCurrentTeamMoves(){
        // Loop through all the current team's pieces
        for (const piece of this.pieces.filter(p => p.team === this.currentTeam)) {
            if (piece.possibleMoves === undefined) continue;

            // Simulate all the piece moves
            for (const move of piece.possibleMoves) {
                const simulatedBoard = this.clone();

                // Remove the piece at the destination position
                simulatedBoard.pieces = simulatedBoard.pieces.filter(p => !p.samePosition(move));

                // Get the piece of the cloned board
                const clonedPiece = simulatedBoard.pieces.find(p => p.samePiecePosition(piece));
                clonedPiece.position = move.clone();

                // Get the king of the cloned board
                const clonedKing = simulatedBoard.pieces.find(p => p.isKing && p.team === simulatedBoard.currentTeam);

                // Loop through all enemy pieces, update their possible moves
                // And check if the current team's king will be in danger
                for (const enemy of simulatedBoard.pieces.filter(p => p.team !== simulatedBoard.currentTeam)) {
                    enemy.possibleMoves = simulatedBoard.getValidMoves(enemy, simulatedBoard.pieces);

                    if (enemy.isPawn) {
                        if (enemy.possibleMoves.some(m => m.x !== enemy.position.x
                            && m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move));
                        }
                    } else {
                        if (enemy.possibleMoves.some(m => m.samePosition(clonedKing.position))) {
                            piece.possibleMoves = piece.possibleMoves?.filter(m => !m.samePosition(move));
                        }
                    }
                }
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
        const destinationPiece = this.pieces.find(piece => piece.samePosition(destination));
        //Castling Move
        if(playedPiece.isKing && destinationPiece?.isRook && destinationPiece?.team === playedPiece.team){
            const direction = destinationPiece.position.x > playedPiece.position.x ? 1 : -1;
            //Move king and rook
            const newKingPosition = playedPiece.position.x + 2 * direction;
            this.pieces = this.pieces.map(piece => {
                if(piece.samePiecePosition(playedPiece)){
                    piece.position.x = newKingPosition;
                }
                else if(piece.samePiecePosition(destinationPiece)){
                    //Move rook to adjacent king square
                    piece.position.x = newKingPosition - direction;
                }
                return piece;   
            });
            this.calculatePossibleMoves();
            return true;
        }

        if(enPassantMove){
            this.pieces = this.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(playedPiece)) {
                    piece.enPassant = false;
                    piece.position.x = destination.x;
                    piece.position.y = destination.y;
                    piece.hasMoved = true;
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
                    
                    piece.hasMoved = true;

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