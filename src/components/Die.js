import './Die.css';

function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white"
    }
  return (

    <div className="Die" style={styles} onClick={props.holdDice}>
        <span className='Die--text'>{props.number}</span>
    </div>
  );
}

export default Die;
