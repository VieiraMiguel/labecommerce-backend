console.log("App iniciado")

const query = process.argv[2]

const items = [{nome:"bananinha"}]

if(!query) {
    console.log("Sem o argumento esperado")
}else{
    const result = items.find(item=>item.nome.includes(query))

    console.log(result)
}