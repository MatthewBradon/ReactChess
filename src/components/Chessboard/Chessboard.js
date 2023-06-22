import { useRef, useState } from "react";
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Referee from "../../referee/Referee";
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE,PieceType, TeamType, initialBoardPieces, samePosition} from "../../Constants";

export default function Chessboard() {
    let board = [];
    const [activePiece, setActivePiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState({x: -1, y: -1});
    const [pieces, setPieces] = useState(initialBoardPieces);
    const [promotionPawn, setPromotionPawn] = useState(null);
    const chessboardRef = useRef(null);
    const modalRef = useRef(null);
    const referee = new Referee();
    
    function promotePawn(type){
        const updatedPieces = pieces.reduce((results, piece) => {
            if(samePosition(piece.position, promotionPawn.position)){
                piece.type = type;
                const teamType = piece.team === TeamType.player ? "w" : "b";
                let image = ""
                switch(type){
                    case PieceType.queen:
                        image = "queen";
                        break;
                    case PieceType.rook:
                        image = "rook";
                        break;
                    case PieceType.bishop:
                        image = "bishop";
                        break;
                    case PieceType.knight:
                        image = "knight";
                        break;
                }
                piece.image = `assets/images/${image}_${teamType}.png`;
            }
            results.push(piece);
            return results;
        }, []);
        setPieces(updatedPieces);
        modalRef.current.classList.add("hidden");
    }
    function promotionTeamType(){
        return promotionPawn?.team === TeamType.player ? "w" : "b";
    }

    function updateValidMoves(){
        //Update the possible moves for each piece
        setPieces((currentPieces) => {
            return currentPieces.map((piece) => {
                piece.possibleMoves = referee.getValidMoves(piece, currentPieces);
                return piece;
            });
        });
    }

    function grabPiece(event) {
        updateValidMoves();
        const element = event.target;
        const chessboard = chessboardRef.current;

        if(element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((event.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((event.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition({x: grabX, y: grabY});

            const offset = GRID_SIZE / 2;
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
            
            const currentPiece = pieces.find((element) => samePosition(element.position, grabPosition));

            //Checks if current piece is not null and if the move is valid
            if(currentPiece){ 
                const validMove = referee.isValidMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);
                const enpassantMove = referee.isEnPassantMove(grabPosition, {x: x, y: y}, currentPiece.type, currentPiece.team, pieces);
                const pawnDirection = currentPiece.team === TeamType.player ? 1 : -1;

                //Reduce function results is array of results piece is a single object
                //Loop through the array and push each element into the results array which updates the pieces array
                //En passant move
                if(enpassantMove){
                    const updatedPieces = pieces.reduce((results, piece) => {
                        if(samePosition(piece.position, grabPosition)) {
                            piece.enPassant = false;
                            piece.position.x = x;
                            piece.position.y = y;
                            results.push(piece);
                        }
                        //Push every piece except the one that was attacked
                        else if(!(samePosition(piece.position, {x: x, y: y - pawnDirection}))){
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
                        if(samePosition(piece.position, grabPosition)){
                            //If the move is a pawn move of 2 squares, set en passant to true
                            piece.enPassant = Math.abs(grabPosition.y - y) === 2 && currentPiece.type === PieceType.pawn
        
                            piece.position.x = x;
                            piece.position.y = y;
                            //Promotion
                            let promotionRow = piece.team === TeamType.player ? 7 : 0;
                            if(y === promotionRow && piece.type === PieceType.pawn){
                                modalRef.current.classList.remove("hidden");
                                setPromotionPawn(piece);
                            }

                            results.push(piece);
                        }
                        //Push every piece except the one that was attacked
                        else if(!(samePosition(piece.position, {x: x, y: y}))) {
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
                    activePiece.style.zIndex = 0;
                }
            }   
            setActivePiece(null);
        }
    }
    //Creates the chessboard tiles and pieces
    for (let j = VERTICAL_AXIS.length-1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const piece = pieces.find(element => samePosition(element.position, {x: i, y: j}));
            let image = piece ? piece.image : null;

            let currentPiece = activePiece !== null ? pieces.find(element => samePosition(element.position, grabPosition)) : undefined;
            let hightlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(piece => samePosition(piece, {x: i, y: j})) : false;
            board.push(<Tile key={`${j},${i}`} number = {i+j} image = {image} highlight = {hightlight}/>);
        }
    }

    return (
        <>
            <div id = "pawn-promotion-modal" className = "hidden" ref = {modalRef}>
                <div className = "modal-body">
                    <img src = {`/assets/images/rook_${promotionTeamType()}.png`} alt = "rook" id = "modal-rook" onClick ={() => promotePawn(PieceType.rook)}/>
                    <img src = {`/assets/images/bishop_${promotionTeamType()}.png`} alt = "bishop" id = "modal-bishop" onClick ={() => promotePawn(PieceType.bishop)}/>
                    <img src = {`/assets/images/knight_${promotionTeamType()}.png`} alt = "knight" id = "modal-knight" onClick ={() => promotePawn(PieceType.knight)}/>
                    <img src = {`/assets/images/queen_${promotionTeamType()}.png`} alt = "queen" id = "modal-queen" onClick ={() => promotePawn(PieceType.queen)}/>
                </div> 
            </div>
            <div 
            onMouseMove={event => movePiece(event)}
            onMouseDown={event => grabPiece(event)}
            onMouseUp={event => dropPiece(event)} 
            id="chessboard"
            ref={chessboardRef}
            >
            {board}
            </div>
        </>
    );    
}