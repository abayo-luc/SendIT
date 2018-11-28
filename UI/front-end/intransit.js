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
        const { parcels } = result;
        dataReady();
        console.log(parcels);
        parcels.map(parcel => {
          $("#in-transit-parcels").append(`
          <tr parcel-id=${parcel.id}>
              <td>${parcel.pickup_location}</td>
              <td>${parcel.address.pickup_address ||
                ""}</td>
              <td class="editable">
                  <span>${parcel.destination}</span>
                  <span class="icon-edit" onclick="openModel(this)">
                      <img src="../assets/icons/edit.svg" alt="*" srcset="" title="Edit" class="lg-icon">
                  </span>
              </td>
              <td>${parcel.address.destination_address ||
                ""}</td>
              <td>
                  <span> Q:${parcel.details.quantity}</span>
                  <span> W:${parcel.details.weight}</span>
                 ${
                   parcel.details.length
                     ? `<span> L:${
                         parcel.details.length
                       }</span>`
                     : ""
                 }
                  ${
                    parcel.details.height
                      ? `<span> H:${
                          parcel.details.height
                        }</span>`
                      : ""
                  }
              </td>
              <td>${new Date(
                parcel.created_at
              ).toDateString()}</td>
              <td class="status">
                  <span>${parcel.status}</span>
                  <span class="icon-cancel" onclick="cancelOrder(this)">
                      <img src="../assets/icons/cancel.svg" alt="*" srcset="" title="Cancel" class="lg-icon">
                  </span>
              </td>
          </tr>
        `);
        });
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
  fetchData(token, user);
});
