const Modal = { //se usar "const" é pq vc não vai alterar isso. caso vc vá alterar, use "let"
    open(){
                // abrir modal
                // adicionar a class active do modal
                document
                .querySelector('.modal-overlay')//faz ele procurar em todo o html o 'modal-overlay'
                .classList
                .add('active')//vai adicioar o 'active' a lista de classes dele.
    },
    close(){
                //fechar o modal
                //remover a class active do modal
                document
                .querySelector('.modal-overlay')
                .classList
                .remove('active')

    }
    }

    const transactions = [
        {
            id: 1,
            description: 'Luz',
            amount: -50050, //esse valor representa -R$500,00. mas não é escrito assim, devido a formatação.
            date: '23/01/2021',
        },
        {
            id: 2,
            description: 'Website',
            amount: 500000,
            date: '23/01/2021',
        },
        {
            id: 3,
            description: 'Internet',
            amount: -20020, 
            date: '23/01/2021',
        },
        {
            id: 4,
            description: 'App',
            amount: 200099, 
            date: '23/01/2021',
        },
]

    // Eu preciso somar as entradas
    // depois eu preciso somar as saídas e 
    // remover das entradas o valor das saídas
    // assim, eu terei o total

const transaction = {
    incomes() {
        let income = 0; //criando a variável
        //pegar todas as transações
        //para cada transação,
        transactions.forEach(transaction => {
            //se ela for maior que zero
            if( transaction.amount > 0) {
                //somar a uma variável e retornar a variável
                income = income + transaction.amount;// += substitui (= income +)
            }
        })
        return income;// retorno da variável
    },
    expenses() {
        let expense = 0;
        transactions.forEach(transaction => {
            if( transaction.amount < 0) {
                expense = expense + transaction.amount;
            }
        })
        return expense;
    },
    total() {
        return transaction.incomes() + transaction.expenses();
    }
}

// Substituir os dados do HTML com os dados do JS
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'), //tirei os "tr"s do tbody do html para que o JS possa colocar os dados.
    addTransaction(transaction, index) { //quando ele for chamado, vai receber transaction e index. 
        const tr = document.createElement('tr') // daí o "tr" será criado,
        tr.innerHTML = DOM.innerHTMLTransaction(transaction) // dentro do innerHTML que vai receber o HTML que está em "innerHTMLTransaction"
        DOM.transactionsContainer.appendChild(tr)//para que eu possa adicionar um child á variável "transactionContainer", criada dentro do DOM. Chirld no caso é o "tr" que eu criei, que é um elemento HTML, criado aqui no JS
        //console.log(tr.innerHTML)
    }, //innerHTML srve para mostrar ou receber um HTML

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense" //se a variável transaction.amonut for maior q 0, então ele vai colocar o transaction na variável income, se não vai para  a expense. Por tanto, a variável CSSclass, agr é uma variável inteligente. É um ótimo modo de verificar se uma informação é verdadeira ou falsa e seguir um caminho.

        const amount = utils.formatCurrency(transaction.amount)

        const html = ` 
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>            
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover Transação">
        </td>
        ` //estou usando um ascento crase ou teria um erro(chama-se: template literals.Ela permite que eu faça a troca por variáveis.)

        return html
    },//para q eu possa usar uma função em outro lugar, ou coisas dela, eu preciso tirar coisas dela com a palavra chave "Return"

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = utils.formatCurrency(transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = utils.formatCurrency(transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = utils.formatCurrency(transaction.total())
    }

}

const utils = { //vai ajustar os valores das transações para adicionar sinal de - caso necessario, adicionar sinal de , e etc.
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "" //se o número for menor que 0, adicione sinal de "-", senão, não adiciona nada.
        value = String(value).replace(/\D/g,"") //trocando numero por string(esse /\D/g,"" quer dizer q ele está pegando os valores e transformando em puro número)
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency", //currency é moeda. É a formatação do valor agr.
            currency: "BRL" //brazilian Real
        })//como é uma funcionalidade, eu tenho dois argumentos
        return signal + value
    }
}

//DOM.addTransaction(transactions[0])// está sendo jogado pra dentro de "addTransaction"
//for(let i = 0; i < 3; i++) {
//    console.log(i)
//} os elementos acima foram substituídos pela função abaixo
transactions.forEach(function(transaction) {
    DOM.addTransaction(transaction)
})//forEach é para ser usados em Arrays. Essa função está substituíndo a outra pq não importa quantos transactions eu adicione ou remova, ela vai continuar valendo
DOM.updateBalance() //torna visível o valor de "updateBalance"
//evite botar as funcionalidades pra fazer muitas coisas