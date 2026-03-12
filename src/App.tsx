import styles from "./app.module.css"
import { useEffect, useState } from "react"

import { WORDS, type Challenge } from "./utils/words"

import { Header } from "./components/Header"
import { Tip } from "./components/Tip"
import { Letter } from "./components/Letter"
import { Input } from "./components/Input"
import { Button } from "./components/Button"
import { LettersUsed, type LettersUsedProps } from "./components/LettersUsed"

export default function App() {

  const [score, setScore] = useState(0)
  const [letter, setLetter] = useState("") // Letra do palpite
  const [lettersUsed, setLettersUsed] = useState<LettersUsedProps[]>([])
  const [challenge, setChallenge] = useState<Challenge | null>(null)

  const ATTEMPTS_MARGIN = 5

  function handleRestartGame() {
    const isConfirmed = window.confirm("Você tem certeza que deseja reiniciar?")

    if (isConfirmed) {
      startGame()
    }
  }

  function startGame() {
    const index = Math.floor(Math.random() * WORDS.length);
    const randowWord = WORDS[index]

    setChallenge(randowWord) // Guardar a palavra no estado

    setScore(0) // Toda vez que resetar, volte a 0
    setLetter("") // Resetar a letra
    setLettersUsed([])
  }

  function handleConfirm() {
    if (!challenge) {
      return
    }

    if (!letter.trim()) {
      return alert("Digite uma letra!")
    }

    const value = letter.toUpperCase() // Recuperar o que foi digitado
    const exists = lettersUsed.find(
      (used) => used.value.toUpperCase() === value
    )

    if (exists) {
      setLetter("")
      return alert("Você já utilizou a letra " + value)
    }

    const hits = challenge.word
    .toUpperCase()
    .split("")
    .filter((char) => char === value).length
    
    const correct = hits > 0
    const currentScore = score + hits

    setLettersUsed((prevState) => [...prevState, { value, correct }]) // Salvar 
    setScore(currentScore)
    setLetter("")
  }

  function endGame(message: string) {
    alert(message)
    startGame()
  }

  useEffect(() => {
    startGame(); // chamar a função sempre que o componente for carregado.
  }, [])

  useEffect(() => {
    if (!challenge) {
      return 
    }

    setTimeout(() => {
      if(score === challenge.word.length) {
        return endGame("Parabéns, você descobriu a palavra!")
      }

      const attemptLimit =challenge.word.length + ATTEMPTS_MARGIN

      if (lettersUsed.length === attemptLimit) {
        return endGame("Que pena, você usou todas as tentativas!")
      }
    }, 200);

  }, [score, lettersUsed.length])

  if (!challenge) {
    return // Caso não tenha, não retorne nada
  }

  return (
    <div className={styles.container}>
      <main>
        <Header 
        current={lettersUsed.length} 
        max={challenge.word.length + ATTEMPTS_MARGIN} 
        onRestart={handleRestartGame}
        />

        <Tip tip={challenge.tip}/>

        <div className={styles.word}>
          {challenge.word.split("").map((letter, index) => {
            const letterUsed = lettersUsed.find(
              (used) => used.value.toUpperCase() === letter.toUpperCase()
            )

            return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"} />
          })}
        </div>
        
        <h4>Palpite</h4>

        <div className={styles.guess}>
          <Input autoFocus
            maxLength={1}
            placeholder="?"
            value={letter}
            onChange={(e) => setLetter(e.target.value)}
          />
          <Button title="Confirmar" onClick={handleConfirm} />
        </div>

        <LettersUsed data={lettersUsed} />

      </main>
    </div>
  )
}