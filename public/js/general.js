async function callApiPrivate(api, vervo, obj = {}, file = false) {
    let token = localStorage.getItem('tkn')
    let user = JSON.parse(localStorage.getItem('user'))

    if (token && user) {
        try {
            let header = { Authorization: token }
            let respuesta = null
            if (vervo == 'put') {
                respuesta = await axios.put(api, obj, { headers: header, user: user._id })
            } else if (vervo === 'get') {
                respuesta = await axios.get(api, { headers: header, user: user._id, params: obj })
            } else if (vervo === 'post') {
                respuesta = await axios.post(api, obj, { headers: header, user: user._id })
            } else if (vervo === 'delete') {
                respuesta = await axios.delete(api, { headers: header, user: user._id })
            }
            return respuesta.data

        } catch (error) {
            return error
        }
    } else {
        window.location.href = "/login"
    }
}

function formatCurrency(num) {
    const options = { style: "currency", currency: "usd", minimumFractionDigits: 2 };
    const numFormat = num.toLocaleString("en-US", options);
    return numFormat
}

function formatDate(isoDate, format) {
    const dateObject = new Date(isoDate)
    const day = dateObject.getUTCDate().toString().padStart(2, '0')
    const month = (dateObject.getUTCMonth() + 1).toString().padStart(2, '0')
    const year = dateObject.getUTCFullYear()

    if (format === 1) {
        return `${day}-${month}-${year}`
    } else if (format === 2) {
        return `${year}-${month}-${day}`
    }

}

//Show menu options
const burgerMenu = document.getElementById('burger-menu-button')
burgerMenu.addEventListener('click',()=>{
    const m = document.getElementById('menuBurger-container')
    m.style = 'display: flex'
})

//Hide menu options
const burgerMenuClose = document.getElementById('close-menu-burger')
burgerMenuClose.addEventListener('click',()=>{
    const m = document.getElementById('menuBurger-container')
    m.style = 'display: none'
})


function showLoading(){
    document.getElementById('loading').style = 'display:flex'
}
function hideLoading(){
    setTimeout(function() {
        document.getElementById('loading').style = 'display:none'
    }, 500)
}