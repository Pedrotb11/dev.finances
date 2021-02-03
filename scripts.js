//pesquisar sobre refatoração na programação
//a partir daqui tudo está sendo montado
const Modal = {
        open() {
            // abrir modal
            // adicionar a class active do modal
            document
                .querySelector('.modal-overlay') //faz ele procurar em todo o html o 'modal-overlay'
                .classList
                .add('active') //vai adicioar o 'active' a lista de classes dele.
        },
        close() {
            //fechar o modal
            //remover a class active do modal
            document
                .querySelector('.modal-overlay')
                .classList
                .remove('active')

        }
    }
    //ciando local de armazenamento abaixo. no F12 do navegador, vc pode ver outros tipos de armazenamento na sessão "aplicativo"

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [] //JSON.parse está transformando string em array. Se não tiver essa chave no local storage, ele pode devolver um array vazio[]. 
    },

    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions)) //sempre usar chave e valor. exemplo ("garrafa", cinza). a chave é o q eu vou pesquisar e os valores são as propriedades da chave. A propriedade "JSON.stringfy", está transformando o array em string.
    }
}

const Transaction = {
        all: Storage.get(),

        add(transaction) {
            Transaction.all.push(transaction) //push é uma funcionalidade atrelada a Arrays.

            App.reload()
        },

        remove(index) {
            Transaction.all.splice(index, 1) //ele vai ver qual a posição do array

            App.reload()
        },

        incomes() {
            let income = 0; //criando a variável
            //pegar todas as transações
            //para cada transação,
            Transaction.all.forEach(transaction => {
                //se ela for maior que zero
                if (transaction.amount > 0) {
                    //somar a uma variável e retornar a variável
                    income = income + transaction.amount; // += substitui (= income +)
                }
            })
            return income; // retorno da variável
        },

        expenses() {
            let expense = 0;
            Transaction.all.forEach(transaction => {
                if (transaction.amount < 0) {
                    expense = expense + transaction.amount;
                }
            })
            return expense;
        },

        total() {
            return Transaction.incomes() + Transaction.expenses();
        }
    }
    // Substituir os dados do HTML com os dados do JS
const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'), //tirei os "tr"s do tbody do html para que o JS possa colocar os dados.
    addTransaction(transaction, index) { //quando ele for chamado, vai receber transaction e index. 
        const tr = document.createElement('tr') // daí o "tr" será criado,
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index) // dentro do innerHTML que vai receber o HTML que está em "innerHTMLTransaction"
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr) //para que eu possa adicionar um child á variável "transactionContainer", criada dentro do DOM. Chirld no caso é o "tr" que eu criei, que é um elemento HTML, criado aqui no JS
    }, //innerHTML srve para mostrar ou receber um HTML

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = ` 
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>            
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
        </td>
        `

        return html
    }, //para q eu possa usar uma função em outro lugar, ou coisas dela, eu preciso tirar coisas dela com a palavra chave "Return"

    updateBalance() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }

}

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100 //ou: value = Number(value.replace(/\,\./g, "")) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "") //trocando numero por string(esse /\D/g,"" quer dizer q ele está pegando os valores e transformando em puro número)
        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields() {
        const { description, amount, date } = Form.getValues()

        if (description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos") //throw vai cuspir um código de erro, caso veja q os campos do formulario estam vazos
        }
    },

    formatValues() {
        let { description, amount, date } = Form.getValues() //let ao invés de construction

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description, //ou "description: description"
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        event.preventDefault()

        try {
            //verificar se todas as informações foram preenchidas
            Form.validateFields()
                //formatar os dados para salvar
            const transaction = Form.formatValues()
                //salvar
            Transaction.add(transaction)
                //apagar os dados do formulario
            Form.clearFields()
                //modal feche
            Modal.close()
        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {

        //a partir daqui tudo está sendo executado
        Transaction.all.forEach((transaction, index) => {
                DOM.addTransaction(transaction, index)
            }) //forEach é para ser usados em Arrays. Essa função está substituíndo a outra pq não importa quantos transactions eu adicione ou remova, ela vai continuar valendo
        DOM.updateBalance() //torna visível o valor de "updateBalance"

        Storage.set(Transaction.all)

    },
    reload() {
        DOM.clearTransactions()
        App.init()
    },
}

App.init()