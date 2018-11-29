const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector(
  "#login-password"
);
const authError = document.querySelector("#auth-error");
const loginButton = document.querySelector("#login-button");
const login = () => {
  cleanError();
  const data = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  fetch("/api/v1/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(async result => {
        const { token, user, message, errors } = result;
        if (token && user) {
          await localStorage.setItem("token", result.token);
          await localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
          user.is_admin
            ? (window.location = "/admin")
            : (window.location = "/client");
          return;
        } else if (message) {
          authError.innerHTML = `<p>${message}</p>`;
          authError.style.display = "block";
          return;
        } else if (errors) {
          // if (errors.email)
          loginEmail.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.email}</p>`;
          loginPassword.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.password}</p>`;
          return;
        }
        return;
      });
    })
    .catch(err => {
      err.json().then(result => {
        const { message } = result;
        message && alert(message);
        return;
      });
    });
};

const cleanError = () => {
  authError.innerHTML = "";
  loginEmail.parentElement.querySelector(
    ".errors"
  ).innerHTML = "";
  loginPassword.parentElement.querySelector(
    ".errors"
  ).innerHTML = "";
  return;
};
loginButton.addEventListener("click", login);
