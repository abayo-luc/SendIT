const getUserParcels = async () => {
  const token = await localStorage.getItem("token");
  const user = await JSON.parse(
    localStorage.getItem("user")
  );
  $("#user-names").append(
    `<p>${user.first_name || ""}</p>`
  );
  $("#user-names").append(`<p>${user.last_name || ""}</p>`);
  fetch(`/api/v1/users/${user.id}/parcels`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(data => {
        const { parcels } = data;
        if (parcels) {
          dataReady();
          parcels.map(parcel => {
            $("#user-parcels").append(`
            <tr>
                <td>${parcel.pickup_location || "..."}</td>
                <td>${parcel.address.pickup_location ||
                  "..."}</td>
                <td>${parcel.destination || "..."}</td>
                <td>${parcel.address.destination_address ||
                  "..."}</td>
                <td>
                    <span> 
                    Q:${parcel.details.quantity}
                    </span> 
                    <span> 
                    W:${parcel.details.weight}
                    </span>
                    <span> 
                    ${
                      parcel.details.length
                        ? `L:${parcel.details.length}`
                        : ""
                    }
                    </span> 
                    <span> 
                    ${
                      parcel.details.height
                        ? `H:${parcel.details.height}`
                        : ""
                    }
                    </span>
                </td>
                <td>${new Date(
                  parcel.created_at
                ).toDateString()}</td>
                <td>....</td>
                <td>....</td>
                <td>${
                  parcel.status === "delivered"
                    ? "delivered"
                    : "false"
                }</td>
            </tr>
            `);
            console.log(parcel);
          });
        }
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
switch (document.readyState) {
  case "loading":
    getUserParcels();
  default:
    "";
}
