import { useRef, useState } from "react";
import './Chessboard.css';
import Tile from '../Tile/Tile';
import { VERTICAL_AXIS, HORIZONTAL_AXIS, GRID_SIZE} from "../../Constants";
import { Position } from "../../models";

export default function Chessboard({playMove, pieces}) {
    let board = [];
    const [activePiece, setActivePiece] = useState(null);
    const [grabPosition, setGrabPosition] = useState(new Position(-1,-1));
    const chessboardRef = useRef(null);
    
    

    function grabPiece(event) {

        const element = event.target;
        const chessboard = chessboardRef.current;

        if(element.classList.contains("chess-piece") && chessboard) {
            const grabX = Math.floor((event.clientX - chessboard.offsetLeft) / GRID_SIZE);
            const grabY = Math.abs(Math.ceil((event.clientY - chessboard.offsetTop - 800) / GRID_SIZE));
            setGrabPosition(new Position(grabX, grabY));

            const offset = GRID_SIZE / 2;
            const x = event.clientX - offset;
            const y = event.clientY - offset;
    
            element.style.position = "absolute";
            element.style.left = `${x}px`;
            element.style.top = `${y}px`;
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
            
            const currentPiece = pieces.find((element) => element.samePosition(grabPosition));

            //Checks if current piece is not null and if the move is valid
            if(currentPiece){
                var success = playMove(currentPiece.clone(), new Position(x, y)); 
                //If the move is not valid, the piece is returned to its original position
                if(!success){
                    activePiece.style.position = "relative";
                    activePiece.style.removeProperty("left");
                    activePiece.style.removeProperty("top");
                }
            } 
            setActivePiece(null);
        }
    }

    //Render the chessboard
    for (let j = VERTICAL_AXIS.length-1; j >= 0; j--) {
        for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
            const piece = pieces.find(element => element.samePosition(new Position(i, j)));
            let image = piece ? piece.image : null;

            let currentPiece = activePiece !== null ? pieces.find(element => element.samePosition(grabPosition)) : undefined;
            let hightlight = currentPiece?.possibleMoves ? currentPiece.possibleMoves.some(piece => piece.samePosition(new Position(i, j))) : false;
            board.push(<Tile key={`${j},${i}`} number = {i+j} image = {image} highlight = {hightlight}/>);
        }
    }

    return (
        <>
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