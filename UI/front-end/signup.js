const formfirstName = document.querySelector("#first_name");
const formlastName = document.querySelector("#last_name");
const fromEmail = document.querySelector("#email");
const formPassword = document.querySelector("#password");
const signupButton = document.querySelector("#btn-signup");
const frompasswordConfirm = document.querySelector(
  "passowrd_confirm"
);

const signup = () => {
  const data = {
    firstName: formfirstName.value,
    lastName: formlastName.value,
    email: fromEmail.value,
    password: formPassword.value
  };
  const headers = {
    "Content-Type": "application/json"
  };
  axios
    .post("/api/v1/users", {
      firstName: formfirstName.value,
      lastName: formlastName.value,
      email: fromEmail.value,
      password: formPassword.value
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err.response));
};

signupButton.addEventListener("click", signup);
