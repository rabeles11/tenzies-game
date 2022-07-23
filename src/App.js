import logo from "./logo.svg";
import "./App.css";
import Die from "./components/Die";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

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

  const [tenzies, setTenzies] = useState(false);

  useEffect(() => {
    const allHeld = dice.every((die) => die.isHeld);
    const firstValue = dice[0].value;
    const allSameValue = dice.every((die) => die.value === firstValue);
    if (allHeld && allSameValue) {
      setTenzies(true);
      console.log("You won");
    }
  }, [dice]);

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

  function rollDice() {
    if (tenzies) {
      setDice(allNewDice());
      setTenzies(false);
    } else {
      setDice((prev) =>
        prev.map((die) => {
          return die.isHeld ? die : generateNewDie();
        })
      );
    }
  }

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">
        Roll until all dice are the same. Click each die to freeze it at its
        current value between rolls.
      </p>
      <div className="dice--container">{Dices}</div>
      <button className="dice--button--roll" onClick={rollDice}>
        {tenzies ? "Reset" : "Roll"}
      </button>
    </main>
  );
}

export default App;
