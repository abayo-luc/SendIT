const emailInput = document.querySelector("#recovery-email");

const submitEmail = () => {
  console.log("click");
  document.getElementById("submit-button").disabled = true;
  document.getElementById("submit-button").innerText = "Submitting....";
  const email = emailInput.value;
  if (!email) {
    return alert("Recovery email is required");
  }
  const data = { email };
  fetch(`/api/v1/forget_password`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON"
    }
  })
    .then(response => {
      if (response.status === 404) {
        document.getElementById("recovery-error").innerText = "User not found";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("submit-button").innerText = "Submit";
      } else if (response.status === 200) {
        response.json().then(result => {
          document.getElementById("login").innerHTML = `
            <div class="logo">
                <img src="../assets/icons/ok-mark.svg" alt="logo" srcset="" />
                <h1>Check your email!</h1>
            </div>
          `;
        });
      } else {
        document.getElementById("recovery-error").innerText =
          "Please try again later!";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("submit-button").innerText = "Submit";
      }
    })
    .catch(err => {
      console.log(err);
    });
};

const clearError = () => {
  document.getElementById("recovery-error").innerText = "";
  return;
};
