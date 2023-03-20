const numeroContra = parseInt(Math.random() * 10)
const escolhaContra = parseInt(Math.random() * 2)

const escolha = process.argv[2]
const numero = process.argv[3]

let parOuImpar = null

console.log(numeroContra)

if (escolhaContra == 0) {

    parOuImpar = "par"
    console.log(parOuImpar)

} else if (escolhaContra == 1) {

    parOuImpar = "impar"
    console.log(parOuImpar)
}

const soma = (numeroContra + Number(numero))
console.log(soma)


if (escolha == "par" && soma % 2 == 0 && escolha != parOuImpar) {

    console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você Ganhou!`)

} else if (escolha == "par" && soma % 2 != 0 && escolha != parOuImpar) {

    console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você Perdeu!`)

} else if (escolha == "impar" && soma % 2 == 0 && escolha != parOuImpar) {

    console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você Perdeu!`)

} else if (escolha =="impar" && soma % 2 != 0 && escolha != parOuImpar) {

    console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você Ganhou!`)

} else if (escolha==parOuImpar) {
    console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Deu Empate!`)

}

// else if (soma / 2 && escolha == "par" && parOuImpar != escolha) {

//     console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você Ganhou!`)

// } else if (!(soma / 2) && escolha == "ímpar" && parOuImpar != escolha) {

//     console.log(`Você escolheu ${escolha} e o computador escolheu ${parOuImpar}. O resultado foi ${soma}. Você perdeu!`)
// }