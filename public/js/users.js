drawTableUsers()
let edit = false
let idEdit = ""


async function drawTableUsers() {
    showLoading()
    try {
        const result = await callApiPrivate(`/api/get-users`, 'get') || []
        localStorage.setItem('users', JSON.stringify(result.users))

        const containerDiv = document.getElementById("abm-users")
        containerDiv.innerHTML = ''

        const table = document.createElement("table")
        table.classList.add("table-detail")

        const headerRow = document.createElement("tr")
        headerRow.classList.add("header-row")
        const header1 = document.createElement("th")
        header1.textContent = "Users"
        const header2 = document.createElement("th")
        header2.textContent = "Role"
        const header3 = document.createElement("th")
        header3.textContent = "Actions"
        headerRow.appendChild(header1)
        headerRow.appendChild(header2)
        headerRow.appendChild(header3)

        table.appendChild(headerRow)

        result.users.forEach(data => {
            const dataRow = document.createElement("tr")
            dataRow.classList.add("row")

            const nameCell = document.createElement("td")
            nameCell.style.color = data.fontColor
            nameCell.classList.add('user-name')
            nameCell.style.backgroundColor = data.color
            nameCell.textContent = data.userName

            const roleCell = document.createElement("td")
            roleCell.textContent = data.role

            const actionsCell = document.createElement("td")
            actionsCell.classList.add('action-buttons')
            const editButtonDiv = document.createElement("div")
            editButtonDiv.setAttribute('onclick', `editUser('${data._id}')`)
            editButtonDiv.innerHTML = '<i class="fa-solid fa-pen icon"></i>'
            editButtonDiv.className = "edit-button"

            const deleteButtonDiv = document.createElement("div");
            deleteButtonDiv.setAttribute('onclick', `deleteUser('${data._id}')`)
            deleteButtonDiv.className = "delete-button";
            deleteButtonDiv.innerHTML = '<i class="fa-solid fa-trash icon"></i>'

            actionsCell.appendChild(editButtonDiv)
            actionsCell.appendChild(deleteButtonDiv)

            dataRow.appendChild(nameCell)
            dataRow.appendChild(roleCell)
            dataRow.appendChild(actionsCell)

            table.appendChild(dataRow)
        })

        containerDiv.appendChild(table)
    } catch (error) {

    }
    hideLoading()
}

function editUser(id) {
    try {
        edit = true
        idEdit = id
        showModal()
        chargeEditForm(id)


    } catch (error) {
        console.log(error)
    }
}

function deleteUser(id) {
    try {
        edit = false
        idEdit = ""

    } catch (error) {

    }
}

function chargeEditForm(id) {
    try {
        const users = JSON.parse(localStorage.getItem('users')) || []

        const result = users.filter(obj => obj._id === id).map(obj => {
            return obj
        })

        const password = document.getElementById('input-password')
        const password2 = document.getElementById('input-password-2')
        const userName = document.getElementById('userName')
        const userID = document.getElementById('userID')

        userID.value = result[0]._id
        userName.value = result[0].userName
        password.style.display = 'none'
        password2.style.display = 'none'

        password.removeAttribute('required')
        password2.removeAttribute('required')

        userName.readOnly = true

    } catch (error) {
        console.log(error)
    }
}

const userSubmit = document.getElementById('form-user')
userSubmit.addEventListener('submit', async (evt) => {
    evt.preventDefault()

    const { userID, userName, role } = evt.target.elements

    const user = {
        _id: userID.value,
        userName: userName.value,
        pass: password.value,
        role: role.value
    }

    console.log(password.value)

    if (edit) {
        showLoading()
        let updateUser = await callApiPrivate('/api/update-user', 'post', user)

        if (updateUser.msg) {
            hideLoading()
            showAlert(`Success `, `${updateUser.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${updateUser.response.data.msg}`, "Err")
        }
        hideModal()
    } else {
        showLoading()
        let newUser = await callApiPrivate('/api/new-user', 'post', user)

        if (newUser.msg) {
            hideLoading()
            showAlert(`Success `, `${newUser.msg}`, "sus")
        } else {
            hideLoading()
            showAlert(`Error `, `${newUser.response.data.msg}`, "Err")
        }
        clearNewCheck()
    }
    drawTableUsers()

})

function deleteUser(id) {
    const users = JSON.parse(localStorage.getItem('users'))

    let usr = users.find(u => u._id === id)
    let del = users.findIndex(u => u._id === id)

    showQuestion(`Are you about to delete the user ${usr.userName}`, `Do you wish to continue?`, async () => {
        if (del !== -1) {
            try {
                showLoading()
                const delUser = await callApiPrivate(`/api/delete-user/${id}`, "delete")
                if (delUser.status === 200) {
                    showAlert(`${usr.userName}`, delUser.msg, "sus")
                }
            } catch (error) {
                console.log(error)
                showAlert("Error", `${error}`, "err")
            }
            drawTableUsers()
        }
    }, () => {
    })


}

function clearNewCheck() {
    const form = document.getElementById('form-user')
    form.reset()
}

const closeModal = document.getElementById('close-modal-2')
closeModal.addEventListener('click', (evt) => {
    const modal = document.getElementById('modal-container')
    modal.style.display = 'none'
})

function showModal() {
    const sm = document.getElementById('modal-container')
    sm.style.display = 'flex'
}

function hideModal() {
    const sm = document.getElementById('modal-container')
    sm.style.display = 'none'
}

const newUser = document.getElementById('newUser')
newUser.addEventListener('click', (evt) => {

    const password = document.getElementById('input-password')
    const password2 = document.getElementById('input-password-2')
    const userName = document.getElementById('userName') 

    password.style.display = "flex"
    password.value = ""
    password2.style.display = "flex"
    password2.value = ""
    password.setAttribute("required", 'true')
    password2.setAttribute("required", 'true')

    userName.value = ""

    
    userName.readOnly = false

    edit = false
    id = ""
    showModal()
})