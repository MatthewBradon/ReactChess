import './Tile.css'


export default function Tile(prop) {
    //Creates class name for tile based on tile number and highlight
    const className = ["tile", prop.number % 2 === 0 ? 'black-tile' : 'white-tile', prop.highlight && 'tile-highlight'].filter(Boolean).join(' ');


    return <div className={className}>
        {prop.image && <div style={{ backgroundImage: `url('${prop.image}')` }} className='chess-piece' />}
    </div>

}