const table = document.querySelector("#table-data");
const modal = document.querySelector("#edit-model");
const allParcelsCard = document.querySelector(
  "#all-parcels"
);
const intransitParcelsCard = document.querySelector(
  "#intransit-parcels"
);
const deliveredParcelsCard = document.querySelector(
  "#delivered-parcels"
);
const currentLocation = document.querySelector(
  "#current-location"
);
const currentAddress = document.querySelector(
  "#current-address"
);
const selectStatus = document.querySelector(
  "#select-status"
);
let parcelId;

(async () => {
  const token = await localStorage.getItem("token");
  fetch("/api/v1/parcels", {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(results => {
        const { parcels } = results;
        if (parcels) {
          parcelCounter(parcels);
          parcels.map(parcel => {
            $("#table-data").append(`
            <tr>
                <td>${parcel.pickup_location}</td>
                <td>${parcel.address.pickup_address ||
                  "..."}</td>
                <td class="editable">
                  <span>${parcel.destination}</span>
                </td>
                <td>${
                  parcel.address.destination_address
                }</td>
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
                <td>${
                  parcel.arrived_at
                    ? new Date(
                        parcel.arrived_at
                      ).toDateString()
                    : "Not Yet"
                }</td>
                <td>
                <small>
                    ${parcel.current_location}
                </small>
                </td>
                <td class="editable">
                    <span class=${parcel.status}>
                        ${parcel.status}
                    </span>
                </td>
                <td class=${parcel.status}>
                  <span
                    class= "icon-edit" ${parcel.status}
                    onclick="changeStatus(${parcel.id})"
                  >
                    <img
                      src="../assets/icons/edit.svg"
                      alt="*"
                      srcset=""
                      title="Update Status & Location"
                      class="md-icon"
                    />
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
})();

const parcelCounter = parcels => {
  allParcelsCard.textContent = parcels.length;
  intransitParcelsCard.textContent = parcels.filter(
    item => item.status == STATUS_INTRANSIT
  ).length;
  deliveredParcelsCard.textContent = parcels.filter(
    item => item.status == STATUS_DELIVERED
  ).length;
};

const changeStatus = async id => {
  if (!id) {
    alert("Parcel not selected");
    return;
  }
  parcelId = id;
  modal.style.display = "block";
};

const updatePresentLocation = async () => {
  const givenlocation = `${currentLocation.value.trim()} ${currentAddress.value.trim()}`;
  if (givenlocation.trim().length < 5) {
    alert("Location not privided");
    return;
  }
  const data = {
    currentLocation: givenlocation,
    status: selectStatus.value
  };
  const token = await localStorage.getItem("token");
  fetch(`/api/v1/parcels/${parcelId}/presentLocation`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(results => {
        const { parcel, message } = results;
        if (parcel) {
          location.reload();
        } else {
          alert(message);
          return;
        }
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
};
const closeModel = () => {
  modal.style.display = "none";
  modal.style.transition = "display 5s";
};

/* anywhere user clikc, should close the model */
window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// thing for viewing one parcel
{
  /* <td>
    <span
        class=${"icon-edit "}
    >
        <img
            src="../assets/icons/eye.svg"
            alt="*"
            srcset=""
            title="view"
            class="md-icon"
        />
    </span>
</td> */
}
