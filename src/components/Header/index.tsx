import logo from "../../assets/logo.png"
import restart from "../../assets/restart.svg"

import styles from "./style.module.css"

type Props = {
    current: number // Tentativas atuais
    max: number // Máximo de tentativas
    onRestart: () => void // Tipagem de um método
}

export function Header({current, max, onRestart}: Props) {
    return (
        <div className={styles.container}>
            <img src={logo} alt="Logo" />

            <header>
                <span>
                    <strong>{current}</strong> de {max} tentativas
                </span>

                <button type="button" onClick={onRestart}>
                    <img src={restart} alt="Ícone de reiniciar" />
                </button>
            </header>

        </div>
    )
}