//the model
const modal = document.getElementById("edit-model");
let parcelId;
const destination = document.querySelector(
  "#model-destination"
);
const destinationAddress = document.querySelector(
  "#model-address"
);
const openModel = element => {
  parcelId = element.parentElement.parentElement.getAttribute(
    "parcel-id"
  );
  modal.style.display = "block";
};

const closeModel = () => {
  modal.style.display = "none";
  modal.style.transition = "display 5s";
};
const updateParcel = () => {
  console.log(parcelId);
};
/* anywhere user clikc, should close the model */
window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
