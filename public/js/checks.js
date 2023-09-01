
//FLAGS !
var LoadedBankAndEnterprise = false //Flag for no loading all the time, only first load JS
var dateStart = "" //Flag dateStarting showing
var dateEnd = "" //Flag dateEnding showing
var dateCheks = ""

//Load currect Date in form NewCheck value createDate
const createDate = document.getElementById('createDate')
const today = new Date()
const formattedDate = today.toISOString().slice(0, 10)
createDate.value = formattedDate

//For Modal's
const modalContainerNewCheck = document.getElementById('modal-container')
const modalContainerDetailCheck = document.getElementById('modal-container-1')
const newCheck = document.getElementById('new-check')

//fullCalendar
var calendar = ""
showLoading()
//SHOW LOADING


//Load list of Bank
async function loadBankList() {
    try {
        const resultado = await callApiPrivate(`/api/getBanks`, 'get')

        const bank = document.getElementById('banks')
        bank.innerHTML = ""

        localStorage.setItem('banks', JSON.stringify(resultado.banks))
        let i = 1

        resultado.banks.forEach((option) => {
            if (i == 1) {
                bank.style.color = option.fontColor
                bank.style.backgroundColor = option.color
            }

            const optionBank = document.createElement("option")
            optionBank.textContent = option.name
            optionBank.style.color = option.fontColor
            optionBank.style.backgroundColor = option.color
            bank.appendChild(optionBank)

            i += 1

        })
    } catch (error) {
        console.error(error)
        throw error
    }
}

//Load list of Enterprises
async function loadEnterprisesList() {
    try {
        LoadedBankAndEnterprise = true
        const result = await callApiPrivate(`/api/enterprises`, 'get')

        const enterprises = document.getElementById('enterprises')
        const enterprises1 = document.getElementById('enterprises-1')
        enterprises.innerHTML = ""
        enterprises1.innerHTML = ""

        let i = 1
        result.enterprise.forEach((option) => {
            if (i == 1) {
                enterprises.style.color = option.fontColor
                enterprises.style.backgroundColor = option.color

                enterprises1.style.color = option.fontColor
                enterprises1.style.backgroundColor = option.color
            }
            const optionEnterprise = document.createElement("option")
            optionEnterprise.textContent = option.name
            optionEnterprise.style.color = option.fontColor
            optionEnterprise.style.backgroundColor = option.color
            optionEnterprise.classList.add('optionList')

            const optionEnterprise1 = document.createElement("option")
            optionEnterprise1.textContent = option.name
            optionEnterprise1.style.color = option.fontColor
            optionEnterprise1.style.backgroundColor = option.color
            optionEnterprise1.classList.add('optionList')

            enterprises.appendChild(optionEnterprise)
            enterprises1.appendChild(optionEnterprise1)
            i += 1
        })

    } catch (error) {
        console.error(error)
        throw error
    }
}

//Get all checks between the 2 dates
async function loadChecks(startDate, endDate) {
    return new Promise((resolve, reject) => {
        const encodedStartDate = startDate.toISOString()
        const encodedEndDate = endDate.toISOString()
        const encodedEnterprise = document.getElementById('enterprises').value

        callApiPrivate(`/api/checks/${encodedStartDate}/${encodedEndDate}/${encodedEnterprise}`, 'get')
            .then(resultado => {
                if (resultado.checks) {
                    localStorage.setItem('checks', JSON.stringify(resultado.checks)) || []
                    renderChecksOnCalendar()
                    resolve()
                }
            })
            .catch(error => {
                console.error(error)
                reject(error)
            })
    })
}

//Wen DOM is loaded, call the function to display the checks
document.addEventListener('DOMContentLoaded', () => {
    const calendarEl = document.getElementById('calendar')
    calendar = new FullCalendar.Calendar(calendarEl, {

        initialView: 'dayGridMonth',

        headerToolbar: {
            start: 'prev,next today', // will normally be on the left. if RTL, will be on the right
            center: 'title',
            end: 'dayGridMonth,listMonth'
        },
        hiddenDays: [0], //hide the sundays
        datesSet: async (x) => {
            dateStart = x.start
            dateEnd = x.end
            loadAll()
        },
        dateClick: function (info) {
            var selectedDate = info.date
            dateCheks = info.dateStr
            
            var eventsOnSelectedDate = calendar.getEvents().filter(function (event) {
                return event.start.getDate() === selectedDate.getDate() &&
                    event.start.getMonth() === selectedDate.getMonth() &&
                    event.start.getFullYear() === selectedDate.getFullYear()
            })

            if (eventsOnSelectedDate.length > 0) {
                showLoading()
                drawCardCheks(dateCheks)
                hideLoading()
            } else {
                console.log('No hay eventos en este día.')
            }
        }
    })
    calendar.render()
})

//Load sync for async function
async function loadAll() {
    showLoading()
    try {
        if (!LoadedBankAndEnterprise) {
            await loadBankList()
            await loadEnterprisesList()
        }
        await loadChecks(dateStart, dateEnd)
    } catch (error) {
        console.error(error)
    }
    hideLoading()
}

//Render LocalStorage checks to calendar
function renderChecksOnCalendar() {
    calendar.removeAllEvents()
    addEvent(sumAmountByBankAndDate())
}

//Clean form newCheck
function clearNewCheck() {
    const form = document.getElementById('from-check')
    form.reset()
}

//Create a new Check
const newCheckSubmit = document.getElementById('from-check')
newCheckSubmit.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const { amount, bank, createDate, debitDate, note, enterprise } = evt.target.elements

    const chk = {
        amount: amount.value,
        bank: bank.value,
        createDate: createDate.value,
        debitDate: debitDate.value,
        note: note.value,
        enterprise: enterprise.value
    }

    let newCheck = await callApiPrivate('/api/check/new', 'post', chk)

    if (newCheck.msg) {
        clearNewCheck()

        const chks = JSON.parse(localStorage.getItem('checks')) || []
        chks.push(newCheck.newChk)
        localStorage.setItem('checks', JSON.stringify(chks))
        renderChecksOnCalendar()
        showAlert(`Success `, `${newCheck.msg}`, "sus")


    } else {
        showAlert(`Error `, `${newCheck.response.data.msg}`, "Err")
    }

})

//Function  to add events to calendar
function addEvent(Arr) {
    Arr.forEach(i => {
        // Create event object
        var nuevoEvento = {
            title: formatCurrency(i.amount),
            start: i.debitDate,
            color: i.color,
            allDay: true,
            success: true
        }
        // Add event to calendar
        calendar.addEvent(nuevoEvento)
    })

}

//Load enterprises and put colors
const enterpriseList = document.getElementById('enterprises')
enterpriseList.addEventListener('change', function () {
    const selectedBGColor = this.options[this.selectedIndex].style.backgroundColor
    const selectedForeColor = this.options[this.selectedIndex].style.color

    this.style.backgroundColor = selectedBGColor
    this.style.color = selectedForeColor
    loadAll()
})

//Load enterprises and put colors in FormNewCheck
const enterpriseList1 = document.getElementById('enterprises-1')
enterpriseList1.addEventListener('click', function () {
    const selectedBGColor = this.options[this.selectedIndex].style.backgroundColor
    const selectedForeColor = this.options[this.selectedIndex].style.color

    this.style.backgroundColor = selectedBGColor
    this.style.color = selectedForeColor
})

//Load banks and put colors in FormNewCheck
const banksList = document.getElementById('banks')
banksList.addEventListener('change', function () {
    const selectedBGColor = this.options[this.selectedIndex].style.backgroundColor
    const selectedForeColor = this.options[this.selectedIndex].style.color

    this.style.backgroundColor = selectedBGColor
    this.style.color = selectedForeColor
})

//Close the modal X
const modalNewCheckClose = document.getElementById('close-modal')
modalNewCheckClose.addEventListener('click', (evt) => {
    hideModalNewCheck()
})

//Function to hide modal NewCheck
function hideModalNewCheck() {
    document.body.classList.remove('modal-open')
    setTimeout(() => {
        modalContainerNewCheck.style = ""
        modalContainerNewCheck.style.display = "none"
    }, 300)
    modalContainerNewCheck.style.animation = "hide-modal 0.3s ease-out forwards"
}

//Function to show modal NewCheck
function showModalNewCheck() {
    document.body.classList.add('modal-open')
    setTimeout(() => {
        modalContainerNewCheck.style.display = "flex"
    }, 300)
    modalContainerNewCheck.style.animation = "show-modal 0.3s ease-out forwards"
}

//New check show modal showModalNewCheck
newCheck.addEventListener('click', () => {
    showModalNewCheck()
})

//Close the modal X List Check
const modalListChecks = document.getElementById('close-modal-1')
modalListChecks.addEventListener('click', (evt) => {
    hideModalListChecks()
})

//Function to hide modal listChecks
function hideModalListChecks() {
    document.body.classList.remove('modal-open')
    setTimeout(() => {
        modalContainerDetailCheck.style = ""
        modalContainerDetailCheck.style.display = "none"
    }, 300)
    modalContainerDetailCheck.style.animation = "hide-modal 0.3s ease-out forwards"
}

//Function to show modal listChecks
function showModalListChecks() {
    document.body.classList.add('modal-open')
    setTimeout(() => {
        modalContainerDetailCheck.style.display = "flex"
    }, 300)
    modalContainerDetailCheck.style.animation = "show-modal 0.3s ease-out forwards"
}

//Function to group amount for banks and dates
function sumAmountByBankAndDate() {

    const transactions = JSON.parse(localStorage.getItem('checks'))
    const banks = JSON.parse(localStorage.getItem('banks'))

    const result = []

    const amountMap = new Map()

    transactions.forEach(transaction => {
        const { amount, bank, debitDate, createDate } = transaction
        const bankInfo = banks.find(bankInfo => bankInfo.name === bank)

        if (bankInfo) {
            const { color, fontColor } = bankInfo

            const key = `${bank}-${debitDate}`
            if (!amountMap.has(key)) {
                amountMap.set(key, {
                    amount: 0,
                    debitDate: formatDate(debitDate, 2),
                    createDate,
                    bank,
                    color,
                    fontColor,
                })
            }
            amountMap.get(key).amount += amount
        }
    })

    amountMap.forEach(value => result.push(value))

    return result
}

//Delete Check
function deleteCheck(id) {
    const chks = JSON.parse(localStorage.getItem('checks'))
    let chk = chks.find(c => c._id === id)
    let borrar = chks.findIndex(c => c._id === id)

    showQuestion("Quiere borrar el cheque", `Bank ${chk.bank} amount ${formatCurrency(chk.amount)}`, async () => {
        if (borrar !== -1) {
            try {
                console.log(id)
                const delCheck = await callApiPrivate(`/api/check/delete/${id}`, "delete")
                showAlert(`${chk.bank}`, delCheck.msg, "sus")

                chks.splice(borrar, 1)
                localStorage.setItem('checks', JSON.stringify(chks))

                drawCardCheks(dateCheks)
            } catch (error) {
                console.log(error)
                showAlert("Deleted Check Error", `${error.msg}`, "err")
            }
        }
    }, () => {
    })
}

//Draw Cards Checks
function drawCardCheks(strDate) {
    console.log("entre de nuevo")
    const chk = JSON.parse(localStorage.getItem('checks')) || []
    const bnk = JSON.parse(localStorage.getItem('banks')) || []
    const checksContainer = document.getElementById('checksContainer')
    const detaiCheckTitle = document.getElementById('detaiCheckTitle')

    var dateParts = strDate.split('-')
    var dateInUTC = new Date(Date.UTC(parseInt(dateParts[1]), parseInt(dateParts[0]) - 1, parseInt(dateParts[2])))

    var daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    var dayOfWeek = daysOfWeek[dateInUTC.getUTCDay()];
    var formattedDate = dayOfWeek + ', ' +
        (dateInUTC.getUTCMonth() + 1).toString().padStart(2, '0') + '/' +
        dateInUTC.getUTCDate().toString().padStart(2, '0') + '/' +
        dateInUTC.getUTCFullYear()

    detaiCheckTitle.innerHTML = formattedDate
    checksContainer.innerHTML = ""



    const transactions = chk.filter(item => {
        const debitDate = new Date(item.debitDate);
        return debitDate.toISOString().split("T")[0] === strDate
    })

    const result = []
    const amountMap = new Map()
    transactions.forEach(transaction => {
        const { amount, bank, debitDate, createDate } = transaction
        const bankInfo = bnk.find(bankInfo => bankInfo.name === bank)

        if (bankInfo) {
            const { color, fontColor } = bankInfo

            const key = `${bank}-${debitDate}`
            if (!amountMap.has(key)) {
                amountMap.set(key, {
                    amount: 0,
                    debitDate: formatDate(debitDate, 2),
                    createDate,
                    bank,
                    color,
                    fontColor,
                })
            }
            amountMap.get(key).amount += amount
        }
    })

    amountMap.forEach(value => result.push(value))

    const detailBankContainer = document.createElement('div')
    detailBankContainer.classList.add('detail-bank-container')
    amountMap.forEach(e => {
        const detailBank = document.createElement('div')
        detailBank.classList.add('detail-bank')
        detailBank.innerHTML = `${e.bank} ${formatCurrency(e.amount)}`
        detailBank.style.color = `${e.fontColor}`
        detailBank.style.backgroundColor = `${e.color}`
        detailBankContainer.appendChild(detailBank)
    })

    checksContainer.appendChild(detailBankContainer)



    chk.forEach(elem => {
        if (formatDate(elem.debitDate, 2) == strDate) {
            const checkCard = document.createElement('div')
            checkCard.classList.add('checkCard')

            const head = document.createElement('div')
            head.classList.add('checkCard__head')
            head.textContent = `${elem.bank}`

            bnk.forEach(e => {
                if (e.name === elem.bank) {
                    head.style.color = `${e.fontColor}`
                    head.style.backgroundColor = `${e.color}`
                }
            })

            const delButton = document.createElement('div')
            delButton.classList.add('checkDelete')
            delButton.setAttribute('onclick', `deleteCheck('${elem._id}')`)

            const trashIcon = document.createElement('i')
            trashIcon.classList.add('fa-solid', 'fa-trash')

            delButton.appendChild(trashIcon)
            head.appendChild(delButton)

            checkCard.appendChild(head)

            const body = document.createElement('div')
            body.classList.add('checkCard__body')

            const debitDate = document.createElement('div')
            debitDate.classList.add('checkCard__body__debit-date')

            const debitTitle = document.createElement('div')
            debitTitle.classList.add('checkCard__body__title')
            debitTitle.textContent = 'Debit Date:'
            debitDate.appendChild(debitTitle)

            const debitText = document.createElement('div')
            debitText.classList.add('checkCard__body__text')
            debitText.textContent = `${formatDate(elem.debitDate, 1)}`
            debitDate.appendChild(debitText)

            body.appendChild(debitDate)

            const createDate = document.createElement('div')
            createDate.classList.add('checkCard__body__create-date')

            const createTitle = document.createElement('div')
            createTitle.classList.add('checkCard__body__title')
            createTitle.textContent = 'Create Date:'
            createDate.appendChild(createTitle)

            const createText = document.createElement('div')
            createText.classList.add('checkCard__body__text')
            createText.textContent = `${formatDate(elem.createDate, 1)}`
            createDate.appendChild(createText)
            body.appendChild(createDate)

            const note = document.createElement('div')
            note.classList.add('checkCard__body__note')

            const noteTitle = document.createElement('div')
            noteTitle.classList.add('checkCard__body__note-title')
            noteTitle.textContent = 'Note:'
            note.appendChild(noteTitle)

            const noteNote = document.createElement('div')
            noteNote.classList.add('checkCard__body__note-note')
            noteNote.textContent = `${elem.note}`
            note.appendChild(noteNote)
            body.appendChild(note)
            checkCard.appendChild(body)

            const footer = document.createElement('div')
            footer.classList.add('checkCard__footer')
            footer.textContent = `${formatCurrency(elem.amount)}`

            bnk.forEach(e => {
                if (e.name === elem.bank) {
                    footer.style.color = `${e.fontColor}`
                    footer.style.backgroundColor = `${e.color}`
                }
            })
            checkCard.appendChild(footer)

            checksContainer.appendChild(checkCard)
        }
        showModalListChecks()
    })


}


