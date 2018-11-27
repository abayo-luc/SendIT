const formFirstName = document.querySelector("#first_name");
const formLastName = document.querySelector("#last_name");
const formEmail = document.querySelector("#email");
const formPassword = document.querySelector("#password");
const formPasswordConfirm = document.querySelector(
  "#passowrd_confirm"
);
const signupButton = document.querySelector("#btn-signup");

const signup = () => {
  cleanError();
  if (
    !checkMatch(password.value, formPasswordConfirm.value)
  ) {
    formPasswordConfirm.parentElement.querySelector(
      ".errors"
    ).innerHTML = `<p>Password mismatch</p>`;
    return;
  }
  const data = {
    firstName: formFirstName.value,
    lastName: formLastName.value,
    email: formEmail.value,
    password: formPassword.value
  };

  fetch("/api/v1/users", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      response.json().then(async results => {
        console.log(results);
        const { errors, message, token, user } = results;
        if (user && token) {
          await localStorage.setItem("token", token);
          await localStorage.setItem(
            "user",
            JSON.stringify(user)
          );
          window.location = "../pages/ClientDashboard.html";
        }
        if (errors && !errors.routine) {
          if (errors.email)
            formEmail.parentElement.querySelector(
              ".errors"
            ).innerHTML = `<p>Required</p>`;
          if (errors.firstName)
            formFirstName.parentElement.querySelector(
              ".errors"
            ).innerHTML = `<p>Required</p>`;
          if (errors.lastName)
            formLastName.parentElement.querySelector(
              ".errors"
            ).innerHTML = `<p>Required</p>`;
          if (errors.password)
            formPassword.parentElement.querySelector(
              ".errors"
            ).innerHTML = `<p>Required</p>`;
          return;
        }
        if (message && errors.routine) {
          document.querySelector(
            "#auth-error"
          ).innerHTML = `<p>${message}</p>`;
          return;
        }
      });
    })
    .catch(err => {
      console.log("failed");
    });
};

const checkMatch = (pwd, pwdConfirm) => {
  return pwd === pwdConfirm;
};

const cleanError = () => {
  formEmail.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  formFirstName.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  formLastName.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  formPassword.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  formPasswordConfirm.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
};
signupButton.addEventListener("click", signup);
