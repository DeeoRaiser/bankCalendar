drawTableEnterprises()
let edit = false
let idEdit = ""


async function drawTableEnterprises() {
    showLoading()
    try {
        const result = await callApiPrivate(`/api/enterprises`, 'get') || []
        localStorage.setItem('enterprises', JSON.stringify(result.enterprise))

        const containerDiv = document.getElementById("abm-enterprises")
        containerDiv.innerHTML = ''

        const table = document.createElement("table")
        table.classList.add("table-detail")

        const headerRow = document.createElement("tr")
        headerRow.classList.add("header-row")
        const header1 = document.createElement("th")
        header1.textContent = "Companies"
        header1.classList.add("header-row__enterprise")
        const header2 = document.createElement("th")
        header2.textContent = "Actions"
        header2.classList.add("header-row__actions")
        headerRow.appendChild(header1)
        headerRow.appendChild(header2)
        table.appendChild(headerRow)

        result.enterprise.forEach(data => {
            const dataRow = document.createElement("tr")
            dataRow.classList.add("row")

            const nameCell = document.createElement("td")
            nameCell.style.color = `${data.fontColor}`
            nameCell.classList.add('enterprise-name')
            nameCell.style.backgroundColor = `${data.color}`
            nameCell.textContent = data.name

            const actionsCell = document.createElement("td")
            actionsCell.classList.add('action-buttons')
            const editButtonDiv = document.createElement("div")
            editButtonDiv.setAttribute('onclick', `editEnterprise('${data._id}')`)
            editButtonDiv.innerHTML = '<i class="fa-solid fa-pen icon"></i>'
            editButtonDiv.className = "edit-button"

            const deleteButtonDiv = document.createElement("div")
            deleteButtonDiv.setAttribute('onclick', `deleteCompany('${data._id}')`)
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

function editEnterprise(id) {
    try {
        edit = true
        idEdit = id
        showModal()
        chargeEditForm(id)
        

    } catch (error) {
        console.log(error)
    }
}


function deleteEnterprise(id) {
    try {
        edit = false
        idEdit = ""

    } catch (error) {

    }
}

function chargeEditForm(id) {
    try {
        const enterprises = JSON.parse(localStorage.getItem('enterprises')) || []

        const result = enterprises.filter(obj => obj._id === id).map(obj => {
            return obj
        })

        const fontColor = document.getElementById('fontColor')
        const backgroundColor = document.getElementById('backgroundColor')
        const enterpriseName = document.getElementById('enterpriseName')
        const enterpriseID = document.getElementById('enterpriseID')

        enterpriseID.value = result[0]._id
        enterpriseName.value = result[0].name
        fontColor.value = result[0].fontColor
        backgroundColor.value = result[0].color

    } catch (error) {
        console.log(error)
    }
}

const enterpriseSubmit = document.getElementById('form-enterprise')
enterpriseSubmit.addEventListener('submit', async (evt) => {
    evt.preventDefault()
    const { enterpriseID, enterpriseName, fontColor, backgroundColor } = evt.target.elements

    const enterprise = {
        _id: enterpriseID.value,
        name: enterpriseName.value,
        fontColor: fontColor.value,
        color: backgroundColor.value
    }

    if (edit) {
        showLoading()
        let updateEnterprise = await callApiPrivate('/api/update-enterprise', 'post', enterprise)
        
        if (updateEnterprise.msg) {
            hideLoading()
            showAlert(`Success `, `${updateEnterprise.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${updateEnterprise.response.data.msg}`, "Err")
        }
        hideModal()
    } else {
        showLoading()
        let newEnterprise = await callApiPrivate('/api/new-enterprise', 'post', enterprise)

        if (newEnterprise.msg) {
            hideLoading()
            showAlert(`Success `, `${newEnterprise.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${newEnterprise.response.data.msg}`, "Err")
        }
        clearNewCheck()
    }
    drawTableEnterprises()
    
})

function deleteCompany(id) {
    const company = JSON.parse(localStorage.getItem('enterprises'))

    let comp = company.find(c => c._id === id)
    let del = company.findIndex(c => c._id === id)

    showQuestion(`Are you about to delete the company ${comp.name}`, `Do you wish to continue?`, async () => {

        if (del !== -1) {
            try {
                showLoading()
                const delCompany = await callApiPrivate(`/api/delete-enterprise/${id}`, "delete")
                console.log(delCompany)
                if (delCompany.status === 200) {
                    showAlert(`${comp.name}`, delCompany.msg, "sus")
                }
            } catch (error) {
                console.log(error)
                showAlert("Error", `${error}`, "err")
            }
            drawTableEnterprises()
        }
    }, () => {
    })


}

function clearNewCheck() {
    const form = document.getElementById('form-enterprise')
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

const newCompany = document.getElementById('newCompany')
newCompany.addEventListener('click',(evt)=>{
    edit = false
    id= ""
    showModal()

})