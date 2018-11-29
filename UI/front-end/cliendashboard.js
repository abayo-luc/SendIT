const allParcelsCard = document.querySelector(
  "#all-parcels"
);
const intransitParcelsCard = document.querySelector(
  "#intransit-parcels"
);
const deliveredParcelsCard = document.querySelector(
  "#delivered-parcels"
);
const getUserParcels = async () => {
  const token = await localStorage.getItem("token");
  const user = await JSON.parse(
    localStorage.getItem("user")
  );
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
          counter(parcels);
          parcels
            .sort((a, b) => b.created_at - a.created_at)
            .map(parcel => {
              $("#user-parcels").append(`
            <tr onClick=getParcel(${
              parcel.id
            }) class="clickable">
                <td>${parcel.pickup_location || "..."}</td>
                <td>${parcel.address.pickup_address ||
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
                <td>
                <span class=${parcel.status}>
                 ${
                   parcel.status === STATUS_DELIVERED
                     ? "Delivered"
                     : parcel.status == STATUS_CANCELED
                     ? "Canceled"
                     : parcel.status == STATUS_INTRANSIT
                     ? "In transit"
                     : "Pending"
                 }
                </span>
                </td>
            </tr>
            `);
            });
        }
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
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

const counter = items => {
  allParcelsCard.textContent = items.length;
  intransitParcelsCard.textContent = items.filter(
    item => item.status == STATUS_INTRANSIT
  ).length;
  deliveredParcelsCard.textContent = items.filter(
    item => item.status == STATUS_DELIVERED
  ).length;
};
