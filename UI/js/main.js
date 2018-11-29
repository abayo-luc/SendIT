const STATUS_INTRANSIT = "in_transit";
const STATUS_DELIVERED = "delivered";
const STATUS_WAITING = "pending";
const STATUS_CANCELED = "canceled";

const showMenu = element => {
  let drpContent = document.getElementById("drp-conent");

  if (drpContent.style.display == "block") {
    element.innerHTML = `<img src="../assets/icons/down-arrow.svg" alt=">>" srcset="" class="md-icon">`;
    drpContent.style.display = "none";
  } else {
    element.innerHTML = `<img src="../assets/icons/up-arrow.svg" alt=">>" srcset="" class="md-icon">`;
    drpContent.style.display = "block";
  }
};

const setUser = async () => {
  const user = await JSON.parse(
    localStorage.getItem("user")
  );
  $("#user-names").append(
    `<p>${user.first_name || ""}</p>`
  );
  $("#user-names").append(`<p>${user.last_name || ""}</p>`);
};

$(document).ready(setUser());

$(async () => {
  const token = await localStorage.getItem("token");
  fetch("/api/v1/current", {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.status === 401) {
        window.location = "/login";
      }
    })
    .catch(err => {
      window.location = "/login";
    });
});
const getParcel = async id => {
  const parcel_id = parseFloat(id);
  await localStorage.setItem("parcel_id", parcel_id);
  window.location = await "/parcel";
};
document
  .querySelector("#lg-logout")
  .addEventListener("click", async () => {
    await localStorage.setItem("token", null);
    await localStorage.setItem("user", null);
    window.location = "/login";
  });
