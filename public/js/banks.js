drawTableBanks()
let edit = false
let idEdit = ""


async function drawTableBanks() {
    showLoading()
    try {
        const result = await callApiPrivate(`/api/getBanks`, 'get') || []
        localStorage.setItem('banks', JSON.stringify(result.banks))

        const containerDiv = document.getElementById("abm-banks")
        containerDiv.innerHTML = ''

        const table = document.createElement("table")
        table.classList.add("table-detail")

        const headerRow = document.createElement("tr")
        const header1 = document.createElement("th")
        headerRow.classList.add("header-row")
        header1.textContent = "Banks"
        header1.classList.add("header-row__bank")
        const header2 = document.createElement("th")
        header2.classList.add("header-row__actions")
        header2.textContent = "Actions"
        headerRow.appendChild(header1)
        headerRow.appendChild(header2)
        table.appendChild(headerRow)

        result.banks.forEach(data => {
            const dataRow = document.createElement("tr")
            dataRow.classList.add("row")

            const nameCell = document.createElement("td")
            nameCell.style.color = `${data.fontColor}`
            nameCell.classList.add('bank-name')
            nameCell.style.backgroundColor = `${data.color}`
            nameCell.textContent = data.name

            const actionsCell = document.createElement("td")
            actionsCell.classList.add('action-buttons')
            const editButtonDiv = document.createElement("div")
            editButtonDiv.setAttribute('onclick', `editBank('${data._id}')`)
            editButtonDiv.innerHTML = '<i class="fa-solid fa-pen icon"></i>'
            editButtonDiv.className = "edit-button"

            const deleteButtonDiv = document.createElement("div")
            deleteButtonDiv.setAttribute('onclick', `deleteBank('${data._id}')`)
            deleteButtonDiv.className = "delete-button"
            deleteButtonDiv.innerHTML = '<i class="fa-solid fa-trash icon"></i>'

            actionsCell.appendChild(editButtonDiv)
            actionsCell.appendChild(deleteButtonDiv)

            dataRow.appendChild(nameCell)
            dataRow.appendChild(actionsCell)

            table.appendChild(dataRow)
        })

        containerDiv.appendChild(table)
    } catch (error) {

    }
    hideLoading()
}

function editBank(id) {
    try {
        edit = true
        idEdit = id
        showModal()
        chargeEditForm(id)
        

    } catch (error) {
        console.log(error)
    }
}


function deleteBank(id) {
    try {
        edit = false
        idEdit = ""

    } catch (error) {

    }
}

function chargeEditForm(id) {
    try {
        const banks = JSON.parse(localStorage.getItem('banks')) || []

        const result = banks.filter(obj => obj._id === id).map(obj => {
            return obj
        })

        const fontColor = document.getElementById('fontColor')
        const backgroundColor = document.getElementById('backgroundColor')
        const bankName = document.getElementById('bankName')
        const bankID = document.getElementById('bankID')

        bankID.value = result[0]._id
        bankName.value = result[0].name
        fontColor.value = result[0].fontColor
        backgroundColor.value = result[0].color

    } catch (error) {
        console.log(error)
    }
}

const bankSubmit = document.getElementById('form-bank')
bankSubmit.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const { bankID, bankName, fontColor, backgroundColor } = evt.target.elements

    const bank = {
        _id: bankID.value,
        name: bankName.value,
        fontColor: fontColor.value,
        color: backgroundColor.value
    }

    if (edit) {
        showLoading()
        let updateBank = await callApiPrivate('/api/update-bank', 'post', bank)
        
        if (updateBank.msg) {
            hideLoading()
            showAlert(`Success `, `${updateBank.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${updateBank.response.data.msg}`, "Err")
        }
        hideModal()
    } else {
        showLoading()
        let newBank = await callApiPrivate('/api/new-bank', 'post', bank)

        if (newBank.msg) {
            hideLoading()
            showAlert(`Success `, `${newBank.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${newBank.response.data.msg}`, "Err")
        }
        clearNewCheck()
    }
    drawTableBanks()
    
})

function deleteBank(id) {
    const bank = JSON.parse(localStorage.getItem('banks'))

    let bnk = bank.find(c => c._id === id)
    let del = bank.findIndex(c => c._id === id)

    showQuestion(`Are you about to delete the bank ${bnk.name}`, `Do you wish to continue?`, async () => {

        if (del !== -1) {
            try {
                showLoading()
                const delBank = await callApiPrivate(`/api/delete-bank/${id}`, "delete")
                if (delBank.status === 200) {
                    showAlert(`${bnk.name}`, delBank.msg, "sus")
                }
            } catch (error) {
                console.log(error)
                showAlert("Error", `${error}`, "err")
            }
            drawTableBanks()
        }
    }, () => {
    })


}

function clearNewCheck() {
    const form = document.getElementById('form-bank')
    form.reset()
}

const closeModal = document.getElementById('close-modal-2')
closeModal.addEventListener('click', (evt)=>{
    const modal = document.getElementById('modal-container')
    modal.style.display = 'none'
})

function showModal(){
    const sm = document.getElementById('modal-container')
    sm.style.display = 'flex'
}

function hideModal(){
    const sm = document.getElementById('modal-container')
    sm.style.display = 'none'
}

const newBank = document.getElementById('newBank')
newBank.addEventListener('click',(evt)=>{
    edit = false
    id= ""
    showModal()

})