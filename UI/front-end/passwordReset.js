const pathnames = location.pathname.split("/");
const token = pathnames[pathnames.length - 1];

const formInputs = document
  .querySelector("#pwd-reset-form")
  .getElementsByTagName("input");

const submitPwd = () => {
  const pwd = formInputs[0].value;
  const confirmPwd = formInputs[1].value;
  if (!pwd || !confirmPwd || pwd != confirmPwd) {
    alert("Invalid password!");
    return;
  }
  const data = {
    password: pwd,
    confirmPassword: confirmPwd
  };
  fetch(`/api/v1/auth/${token}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      if (response.status === 200) {
        window.location = "/login";
      } else if (response.status === 404) {
        console.log(response);
        document.getElementById("reset-error").innerText = "User not found";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("submit-button").innerText = "Submit";
      } else {
        document.getElementById("reset-error").innerText = "Invalid password";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("submit-button").innerText = "Submit";
      }
    })
    .catch(err => {
      console.log(err);
    });
};
