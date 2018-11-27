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

const getCreatedParcel = ({ id, parcel }) => {
  parcelDestination.textContent = parcel.destination;
  parcelDestinationAddress.textContent =
    parcel.address.destination_address || "";
  parcelPickup.textContent = parcel.pickup_location;
  parcelPickupAddress.textContent =
    parcel.address.pickup_address || "";
  parcelWeight.textContent = parcel.details.parcelWeight;
  parcelHeight.textContent = parcel.details.height || "";
  parcelWidth.textContent = parcel.details.width || "";
  parcelQuantity.textContent = parcel.details.quantity;
};
