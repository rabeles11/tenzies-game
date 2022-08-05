import logo from "./logo.svg";
import "./App.css";
import Die from "./components/Die";
import { useState, useEffect, useCallback } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import { firebase } from "./initFirebase.ts";
import Modal from 'react-modal';
import Form from "./components/Form";
import { FaTrophy } from 'react-icons/fa';

const db = firebase.database();

function App() {
  /**
   * Challenge: Update the `holdDice` function to flip
   * the `isHeld` property on the object in the array
   * that was clicked, based on the `id` prop passed
   * into the function.
   *
   * Hint: as usual, there's > 1 way to accomplish this.
   * I'll be using `dice.map()` and checking for the `id`
   * of the die to determine which one to flip `isHeld` on,
   * but you can do whichever way makes the most sense to you.
   */
  const [dice, setDice] = useState(allNewDice);
  const [timer,setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [modalIsOpenLeaderBoard, setIsOpenLeaderBoard] = useState(false);
  const [numberRoll, setNumberRoll] = useState(0);
  const [bestScore, setBestScore] = useState(
    () => JSON.parse(localStorage.getItem("score")) || "N/A"
  );
  const [tenzies, setTenzies] = useState(false);
  

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const nothingHeld = dice.every((die) => !die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if(nothingHeld){
      setNumberRoll(0);
      setIsActive(true);
      setTimer(0);
    }
    if (allHeld && allSameValue) {
      setTenzies(true);
      setIsActive(false);
      console.log("You won");
      let placeholder = bestScore === "N/A" ? 1000 : bestScore;
      if ((numberRoll/timer).toFixed(2) < placeholder) {
        localStorage.setItem("score", JSON.stringify((numberRoll/timer).toFixed(2)));
        setBestScore((numberRoll/timer).toFixed(2));
        openModal();
      }
    }
  }, [dice]);

  useEffect(() => {
    console.log("test");
    let interval = null;
    if(isActive){
      interval = setInterval(() => {
        setTimer((seconds)=> seconds + 1);;
      }, 1000);
    }
    return () => clearInterval(interval);
  },[timer,isActive])

  const Dices = dice.map((die) => (
    <Die
      holdDice={() => holdDice(die.id)}
      key={die.id}
      number={die.value}
      isHeld={die.isHeld}
    />
  ));

  function holdDice(id) {
    setDice((prev) =>
      prev.map((die) => {
        return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
      })
    );
  }
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModalLeaderBoard() {
    setIsOpenLeaderBoard(true);
  }

  function closeModalLeaderBoard() {
    setIsOpenLeaderBoard(false);
  }

  function generateNewDie() {
    return {
      value: Math.floor(Math.random() * 6) + 1,
      isHeld: false,
      id: nanoid(),
    };
  }

  function allNewDice() {
    const newArray = [];
    for (let i = 0; i < 10; i++) {
      newArray.push(generateNewDie());
    }
    return newArray;
  }

  function ShowLeaderBoard(){
    openModalLeaderBoard();
  }

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(false);
      setNumberRoll(0);
    } else {
      setDice((prev) =>
        prev.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
      setNumberRoll((roll) => roll + 1);
    }
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const onSubmit = (event) => {
    event.preventDefault(event);
    const test = db.ref("TopUsers")
    const newrecord = test.push();
    newrecord.set(
      {
        player: event.target.name.value,
        bestScore: (numberRoll/timer).toFixed(2),
      }
    )
    closeModal();
  };


  return (
    <main>
      {tenzies && <Confetti />}
      <div className="titleDiv">
        <h1 className="title">Tenzies</h1>
      </div>
      <span className="HighScore">Best score: {bestScore} points</span>
      <span className="TimerCount">Time: {timer} s</span>
      <span className="score">Number of rolls: {numberRoll} </span>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice--container">{Dices}</div>
      <button className="dice--button--roll" onClick={rollDice}>
        {tenzies ? "Reset" : "Roll"}
      </button>
      <button className="dice--button--leaderboard" onClick={ShowLeaderBoard}>
        <div className="leaderboard--text">
      <FaTrophy className="Icon-Trophy"/>  Leaderboard  <FaTrophy className="Icon-Trophy"/>
        </div>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        >
          <div className="Form-Title">Congrats you reached new highscore
          <span>{(numberRoll/timer).toFixed(2)}</span>
          </div>
          <Form onSubmit={onSubmit}/>
      </Modal>
      <Modal
        isOpen={modalIsOpenLeaderBoard}
        onRequestClose={closeModalLeaderBoard}
        style={customStyles}
        >
      </Modal>
    </main>
  );
}

export default App;
