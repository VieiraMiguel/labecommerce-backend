const random = parseInt(Math.random() * 3)

let escolhaContra

if (random === 0) {
    escolhaContra = "pedra"
} else if (random === 1) {
    escolhaContra = "papel"
} else if (random ===2) {
    escolhaContra = "tesoura"
}


const escolha = process.argv[2]

if (escolha == "pedra" && escolhaContra == "papel") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você perdeu!`)
} else if (escolha == "pedra" && escolhaContra == "tesoura") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você ganhou!`)
} else if (escolha == "papel" && escolhaContra == "pedra") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você ganhou!`)
} else if (escolha == "papel" && escolhaContra == "tesoura") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você perdeu!`)
} else if (escolha == "tesoura" && escolhaContra == "pedra") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você perdeu!`)
} else if (escolha == "tesoura" && escolhaContra == "papel") {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Você ganhou!`)
} else {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${escolhaContra}. Empatou!`)

}