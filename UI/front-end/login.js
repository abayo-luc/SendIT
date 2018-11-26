const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector(
  "#login-password"
);
const loginButton = document.querySelector("#login-button");
const login = () => {
  const data = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  axios
    .post("/api/v1/login", data)
    .then(async response => {
      const { data } = response;
      await localStorage.setItem("token", data.token);
      window.location = "../pages/ClientDashboard.html";
    })
    .catch(err => console.log(err.response));
};

loginButton.addEventListener("click", login);
