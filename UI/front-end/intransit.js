const fetchData = async (token, user) => {
  fetch(`/api/v1/users/${user.id}/parcels?inTransit=true`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(result => {
        dataReady();
        console.log($("#in-transit-parcels"));
        console.log(result);
      });
    })
    .catch(err => {
      console.log(err);
    });
};
const dataReady = () => {
  $("#loader").css("display", "none");
  $("#loaded-data").css("display", "block");
  return;
};
$(document).ready(async () => {
  const token = await localStorage.getItem("token");
  const user = await JSON.parse(
    localStorage.getItem("user")
  );
  $("#user-names").append(
    `<p>${user.first_name || ""}</p>`
  );
  $("#user-names").append(`<p>${user.last_name || ""}</p>`);
  fetchData(token, user);
});
