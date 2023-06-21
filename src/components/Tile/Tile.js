import './Tile.css'


export default function Tile(prop) {
    return <div className={`tile ${prop.number % 2 === 0 ? 'black-tile' : 'white-tile'}`}>
        {prop.image && <div style={{ backgroundImage: `url('${prop.image}')`}} className='chess-piece'/>}
    </div>
    
}