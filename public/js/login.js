clearLocalStorage()

function clearLocalStorage(){
  localStorage.removeItem("tkn")
  localStorage.removeItem("checks")
  localStorage.removeItem("user")
  localStorage.removeItem("banks")
  localStorage.removeItem("users")
  localStorage.removeItem("enterprises")
}

function watchPass() {
  const pass = document.getElementById('password')
  const eye = document.getElementById('eye')
  if (pass.type == 'text') {
    pass.type = 'password'
    eye.classList.remove('eyeOn')
  } else {
    pass.type = 'text'
    eye.classList.add('eyeOn')
  }
}


const loginForm = document.getElementById("loginForm")
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault()
  try {
    const data = {
      userLogin: loginForm.elements.username.value,
      passwordLogin: loginForm.elements.password.value
    }
    const resp = await axios.post("/api/login", data)
    if (resp.data.msg = 'Login successful') {
      localStorage.setItem('tkn', resp.data.token)
      localStorage.setItem('user', JSON.stringify(resp.data.user))
      window.location.href = "/"
    }
  } catch (err) {
    showAlert(`Error `, `${err.response.data.msg}`, "err")
  }
})
