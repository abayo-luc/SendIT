const editCancelBtns = document.querySelector(
  "#action-btn"
);

// editCancelBtns.styles.display = "none";
const parcelPickup = document.querySelector("#var-pickup");
const parcelPickupAddress = document.querySelector(
  "#var-pickup-adr"
);
const parcelDestination = document.querySelector(
  "#var-destination"
);
const parcelDestinationAddress = document.querySelector(
  "#var-destination-adr"
);
const parcelWeight = document.querySelector("#var-weight");
const parcelHeight = document.querySelector("#var-height");
const parcelWidth = document.querySelector("#var-width");
const parcelQuantity = document.querySelector(
  "#var-quantity"
);
const parcelStatus = document.querySelector(
  "#parcel-status"
);

(async () => {
  const token = await localStorage.getItem("token");
  const parcel_id = await localStorage.getItem("parcel_id");
  fetch(`/api/v1/parcels/${parcel_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(results => {
        const { parcel } = results;
        if (parcel) {
          parcelDestination.textContent =
            parcel.destination;
          parcelDestinationAddress.textContent =
            parcel.address.destination_address || "--";
          parcelPickup.textContent = parcel.pickup_location;
          parcelPickupAddress.textContent =
            parcel.address.pickup_address || "--";
          parcelWeight.textContent = `${
            parcel.details.weight
          } g`;
          parcelHeight.textContent = `${parcel.details
            .height || "--"} Cm`;
          parcelWidth.textContent = `${parcel.details
            .width || "--"} Cm`;
          parcelQuantity.textContent =
            parcel.details.quantity;
          parcelStatus.classList.add(parcel.status);
          parcelStatus.textContent =
            parcel.status == STATUS_CANCELED
              ? "Canceled"
              : parcel.status == STATUS_INTRANSIT
              ? "In transit"
              : parcel.status == STATUS_DELIVERED
              ? "Delivered"
              : "Pending";
          parcel.status !== STATUS_DELIVERED &&
          parcel.status != STATUS_CANCELED
            ? (editCancelBtns.innerHTML = `
            <div class="col-2"></div>
            <div class="col-3 padding">
              <button class="btn btn-block btn-default" onClick=parcelModel(${
                parcel.id
              })>
                Edit
              </button>
            </div>
            <div class="col-1"></div>
            <div class="col-3 padding" style="float:right">
              <button
                class="btn btn-block btn-danger"
                id="cancel-parcel"
                onClick=cancelParcel(${parcel.id})
              >
                Cancel
              </button>
            </div>
          `)
            : null;
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
})();

const cancelParcel = async id => {
  const token = await localStorage.getItem("token");
  fetch(`/api/v1/parcels/${id}/cancel`, {
    method: "PUT",
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(results => {
        const { parcel } = results;
        if (parcel) {
          location.reload();
        }
      });
    })
    .catch(err => {
      alert("Sorry, something went wrong!");
      return;
    });
};
