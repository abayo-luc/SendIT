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
  const currentDestination =
    element.parentElement.parentElement.children[2]
      .innerText;
  const currentAddress =
    element.parentElement.parentElement.children[3]
      .innerText;
  destinationAddress.value = currentAddress.trim();
  for (let option of destination.options) {
    if (currentDestination.trim() == option.value.trim()) {
      option.selected = true;
    }
  }
  modal.style.display = "block";
};

const parcelModel = id => {
  parcelId = id;
  modal.style.display = "block";
};

const closeModel = () => {
  modal.style.display = "none";
  modal.style.transition = "display 5s";
};
const updateParcel = async () => {
  const data = {
    destination: destination.value,
    destinationAddress: destinationAddress.value
  };
  const token = await localStorage.getItem("token");
  fetch(`/api/v1/parcels/${parcelId}/destination`, {
    method: "PUT",
    body: JSON.stringify(data),
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
      console.log(err);
    });
};
/* anywhere user clikc, should close the model */
window.onclick = event => {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
