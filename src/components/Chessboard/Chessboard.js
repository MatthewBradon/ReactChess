import { useRef, useState } from "react";
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from "../../referee/Referee";



const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8]

export const PieceType = {
    pawn: 0, 
    rook: 1,
    knight: 2,
    bishop: 3,
    queen: 4,
    king: 5
};

export const TeamType = {
    opponent: 0,
    player: 1
};

const initialBoardPieces = [];

for(let i = 0; i < 2; i++){
    const teamType = (i === 0) ? TeamType.opponent : TeamType.player;
    const type = (teamType === TeamType.opponent) ? "b" : "w";
    const y = (teamType === TeamType.opponent) ? 7 : 0;

    initialBoardPieces.push({image: `assets/images/rook_${type}.png`, x: 0, y, type: PieceType.rook, team: teamType});
    initialBoardPieces.push({image: `assets/images/rook_${type}.png`, x: 7, y, type: PieceType.rook, team: teamType});
    initialBoardPieces.push({image: `assets/images/knight_${type}.png`, x: 1, y, type: PieceType.knight, team: teamType});
    initialBoardPieces.push({image: `assets/images/knight_${type}.png`, x: 6, y, type: PieceType.knight, team: teamType});
    initialBoardPieces.push({image: `assets/images/bishop_${type}.png`, x: 2, y, type: PieceType.bishop, team: teamType});
    initialBoardPieces.push({image: `assets/images/bishop_${type}.png`, x: 5, y, type: PieceType.bishop, team: teamType});
    initialBoardPieces.push({image: `assets/images/queen_${type}.png`, x: 3, y, type: PieceType.queen, team: teamType});
    initialBoardPieces.push({image: `assets/images/king_${type}.png`, x: 4, y, type: PieceType.king, team: teamType});
}
// Pawns
for(let i = 0; i < 8; i++) {
    initialBoardPieces.push({image: "/assets/images/pawn_w.png", x: i, y: 1, type: PieceType.pawn, team: TeamType.player, enPassant : false});
    initialBoardPieces.push({image: "/assets/images/pawn_b.png", x: i, y: 6, type: PieceType.pawn, team: TeamType.opponent, enPassant : false});
}



export default function Chessboard() {
    let board = [];
    const [activePiece, setActivePiece] = useState(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState(initialBoardPieces);
    const chessboardRef = useRef(null);
    const referee = new Referee();
    

    function grabPiece(event) {
        const element = event.target;
        const chessboard = chessboardRef.current;
        if(element.classList.contains("chess-piece") && chessboard) {

            setGridX(Math.floor((event.clientX - chessboard.offsetLeft) / 100));
            setGridY(Math.abs(Math.ceil((event.clientY - chessboard.offsetTop - 800) / 100)));
            const offset = 45;
            const x = event.clientX - offset;
            const y = event.clientY - offset;
    
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
            element.style.zIndex = 1000;
    
            setActivePiece(element);
        }
    }
    
    function movePiece(event){
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard) {

            //Calculate the min and max values for the piece to be within the chessboard
            const minX = chessboard.offsetLeft - 25;
            const minY = chessboard.offsetTop - 10;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - 65;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - 65;


            //Follows mouse cursor
            const offset = 40;
            const x = event.clientX - offset;
            const y = event.clientY - offset;
    
            activePiece.style.position = "absolute";
            activePiece.style.zIndex = 1000;


            //Keep the piece within the chessboard
            activePiece.style.left = x < minX ? `${minX}px` : x > maxX ? `${maxX}px` : `${x}px`;
            activePiece.style.top = y < minY ? `${minY}px` : y > maxY ? `${maxY}px` : `${y}px`;

            
        }
    }
    
    function dropPiece(event) {
        const chessboard = chessboardRef.current;
        if(activePiece && chessboard) {
            const x = Math.floor((event.clientX - chessboard.offsetLeft) / 100);
            const y = Math.abs(Math.ceil((event.clientY - chessboard.offsetTop - 800) / 100));
            
            const currentPiece = pieces.find((element) => element.x === gridX && element.y === gridY);
            const attackedPiece = pieces.find((element) => element.x === x && element.y === y);

            //Checks if current piece is not null and if the move is valid
            if(currentPiece){ 
                const validMove = referee.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);
                const enpassantMove = referee.isEnPassantMove(gridX, gridY, x, y, currentPiece.type, currentPiece.team, pieces);
                const pawnDirection = currentPiece.team === TeamType.player ? 1 : -1;
                //Reduce function results is array of results piece is a single object
                //Loop through the array and push each element into the results array
                //En passant move
                if(enpassantMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(piece.x === gridX && piece.y === gridY) {
                            piece.enPassant = false;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        //Push every piece except the one that was attacked
                        else if(!(piece.x === x && piece.y === y - pawnDirection)) {
                            if(piece.type === PieceType.pawn){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }   
                        return results;
                    }, []);
                    setPieces(updatedPieces);
                }
                //Normal move
                else if(validMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(piece.x === gridX && piece.y === gridY) {
                            //If the move is en passant, remove the attacked piece
                            if(Math.abs(gridY - y) === 2 && currentPiece.type === PieceType.pawn) {
                                piece.enPassant = true;
                            }
                            else {
                                piece.enPassant = false;
                            }
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        }
                        //Push every piece except the one that was attacked
                        else if(!(piece.x === x && piece.y === y)) {
                            if(piece.type === PieceType.pawn){
                                piece.enPassant = false;
                            }
                            results.push(piece);
                        }   
                        return results;
                    }, []);

                    setPieces(updatedPieces);
                }
                else {
                    //If the move is not valid, return the piece to its original position
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("left");
                    activePiece.style.removeProperty("top");
                }
            }   
            setActivePiece(null);
        }
    }

    for (let j = verticalAxis.length-1; j >= 0; j--) {
        for (let i = 0; i < horizontalAxis.length; i++) {
            let image = null;

            pieces.forEach(element => {
                if(element.x === i && element.y === j) {
                    image = element.image;
                }
            });

            board.push(<Tile key={`${j},${i}`} number = {i+j} image = {image}/>);
        }
    }

    return <div 
        onMouseMove={event => movePiece(event)}
        onMouseDown={event => grabPiece(event)}
        onMouseUp={event => dropPiece(event)} 
        id="chessboard"
        ref={chessboardRef}
        >
        {board}
        </div>
}