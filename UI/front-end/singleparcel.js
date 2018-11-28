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
        }
      });
    })
    .catch(err => {
      console.log(err);
    });
})();
