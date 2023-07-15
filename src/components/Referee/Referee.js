import { useEffect, useRef, useState } from "react";
import { initialBoard} from "../../Constants";
import Chessboard from "../Chessboard/Chessboard";
import { Piece, Position } from "../../models";
import {pawnMove,
        knightMove,
        bishopMove,
        rookMove,
        queenMove,
        kingMove} from "../../referee/rules";
import { PieceType, TeamType } from "../../Types";


export default function Referee() {
    //Hooks
    const [board, setBoard] = useState(initialBoard.clone());
    const [promotionPawn, setPromotionPawn] = useState(null);
    const modalRef = useRef(null);
    const checkmateModalRef = useRef(null);
    const stalemateModalRef = useRef(null);

    function playMove(playedPiece, destination){
        if(playedPiece.team === TeamType.player && board.totalTurns % 2 === 0) return false;
        else if(playedPiece.team === TeamType.opponent && board.totalTurns % 2 !== 0) return false;
        
        //const validMove = isValidMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        if(playedPiece.possibleMoves === undefined) return false;

        let isPlayedMoveValid = false;
        const validMove = playedPiece.possibleMoves?.some(move => move.samePosition(destination));

        if(!validMove) return false;

        const enpassantMove = enPassantMove(playedPiece.position, destination, playedPiece.type, playedPiece.team);
        

        //Plays the move and updates the board
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.totalTurns++;
            isPlayedMoveValid = clonedBoard.playMove(enpassantMove, validMove, playedPiece, destination);
            
            if(clonedBoard.winningTeam === "draw"){
                //Stalemate
                stalemateModalRef.current.classList.remove("hidden");
            }
            else if(clonedBoard.winningTeam !== undefined){
                //Checkmate
                checkmateModalRef.current.classList.remove("hidden");
            }
            console.log(clonedBoard.winningTeam);
            return clonedBoard;
        });

        //Promotion
        let promotionRow = playedPiece.team === TeamType.player ? 7 : 0;
        if(destination.y === promotionRow && playedPiece.isPawn){
            modalRef.current.classList.remove("hidden");
            setPromotionPawn((previousPromotionPawn) => {
                const clonedPromotionPawn = playedPiece.clone();
                clonedPromotionPawn.position = destination.clone();
                return clonedPromotionPawn;
            }
            );
        }

        return isPlayedMoveValid;
    }

    
    function enPassantMove(initialPosition, desiredPosition, pieceType, team){

        const direction = team === TeamType.player ? 1 : -1;
        
        if(pieceType === PieceType.pawn){

            //Checking if the piece moved left or right
            if((desiredPosition.x - initialPosition.x === -1 || desiredPosition.x - initialPosition.x === 1) && desiredPosition.y - initialPosition.y === direction){

                //Return true if the piece's enPassant flag is true and the piece is in the correct position
                return board.pieces.find((elem) => elem.samePosition(new Position(desiredPosition.x,desiredPosition.y - direction)) && elem.enPassant) !== undefined;
            }
        }

        return false;
    }
    function promotePawn(type){
        if(promotionPawn === undefined){
            const clonedBoard = board.clone();
            clonedBoard = [];
            return clonedBoard;
        }
        setBoard(() => {
            const clonedBoard = board.clone();
            clonedBoard.pieces = clonedBoard.pieces.reduce((results, piece) => {
                if(piece.samePiecePosition(promotionPawn)){
                    results.push(new Piece(type, piece.team, piece.position.clone(), piece.hasMoved));
                } else {
                    results.push(piece);
                }
                return results;
            }, []);
            clonedBoard.calculatePossibleMoves();
            return clonedBoard;
        });

        
        
        modalRef.current.classList.add("hidden");
    }

    function promotionTeamType(){
        return promotionPawn?.team === TeamType.player ? "w" : "b";
    }

    function restartGame(){
        stalemateModalRef.current.classList.add("hidden");
        checkmateModalRef.current.classList.add("hidden");
        setBoard(initialBoard.clone());

    }

    return (
    <>
        <p>Turn: {board.totalTurns}</p>
        <div className = "modal hidden" ref = {modalRef}>
            <div className = "modal-body">
                <img src = {`/assets/images/rook_${promotionTeamType()}.png`} alt = "rook" id = "modal-rook" onClick ={() => promotePawn(PieceType.rook)}/>
                <img src = {`/assets/images/bishop_${promotionTeamType()}.png`} alt = "bishop" id = "modal-bishop" onClick ={() => promotePawn(PieceType.bishop)}/>
                <img src = {`/assets/images/knight_${promotionTeamType()}.png`} alt = "knight" id = "modal-knight" onClick ={() => promotePawn(PieceType.knight)}/>
                <img src = {`/assets/images/queen_${promotionTeamType()}.png`} alt = "queen" id = "modal-queen" onClick ={() => promotePawn(PieceType.queen)}/>
            </div> 
        </div>
        <div className = "modal hidden" ref = {checkmateModalRef}>
            <div className = "modal-body">
                <div className = "checkmate-body">
                    <span>Checkmate! The winner is {board.winningTeam === TeamType.player ? "white" : "black"}!</span>
                    <button onClick={restartGame}>Play Again</button>
                </div>
            </div>
        </div>
        <div className = "modal hidden" ref = {stalemateModalRef}>
            <div className = "modal-body">
                <div className = "checkmate-body">
                    <span>Stalemate: its a draw!</span>
                    <button onClick={restartGame}>Play Again</button>
                </div>
            </div>
        </div>
        <Chessboard playMove={playMove} pieces={board.pieces}/>
    </>
    )
}