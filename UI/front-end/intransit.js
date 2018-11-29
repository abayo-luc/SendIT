//fetch data in transit
const fetchData = async (token, user) => {
  fetch(
    `/api/v1/users/${
      user.id
    }/parcels?status=${STATUS_INTRANSIT}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "Application/JSON",
        Authorization: `Bearer ${token}`
      }
    }
  )
    .then(response => {
      response.json().then(result => {
        const { parcels } = result;
        dataReady();
        parcels.map(parcel => {
          $("#in-transit-parcels").append(`
          <tr class="clickable" onClick=getParcel(${
            parcel.id
          })>
              <td>${parcel.pickup_location}</td>
              <td>${parcel.address.pickup_address ||
                ""}</td>
              <td class="editable">
                  <span>${parcel.destination}</span>
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
                  <span class=${
                    parcel.status
                  }>in transit</span>
                  <span class="icon-cancel" onClick=onCancel(${
                    parcel.id
                  })>
                  </span>
              </td>
          </tr>
        `);
        });
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
};
//display the table once data are ready
const dataReady = () => {
  $("#loader").css("display", "none");
  $("#loaded-data").css("display", "block");
  return;
};
//initial load the fucntion to query data
$(document).ready(async () => {
  const token = await localStorage.getItem("token");
  const user = await JSON.parse(
    localStorage.getItem("user")
  );
  fetchData(token, user);
});
