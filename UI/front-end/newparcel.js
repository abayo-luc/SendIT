const destination = document.querySelector("#destination");
const pickupLocation = document.querySelector(
  "#pickup_location"
);
const destinationAddress = document.querySelector(
  "#destination_address"
);
const pickupAddress = document.querySelector(
  "#pickup_address"
);
const quantity = document.querySelector("#quantity");
const weight = document.querySelector("#weight");
const length = document.querySelector("#length");
const width = document.querySelector("#width");
const height = document.querySelector("#height");
const saveParcel = async () => {
  clearErrors();
  const data = {
    //#send-parcel
    destination: destination.value || null,
    pickupLocation: pickupLocation.value || null,
    destinationAddress: destinationAddress.value || null,
    pickupAddress: pickupAddress.value || null,
    quantity: quantity.value || null,
    weight: weight.value || null,
    length: length.value || null,
    width: width.value || null,
    height: height.value || null
  };
  const token = await localStorage.getItem("token");
  fetch("/api/v1/parcels", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "Application/JSON",
      Authorization: `Bearer ${token}`
    }
  })
    .then(response => {
      response.json().then(async results => {
        const { errors, parcel } = results;
        console.log(errors, parcel);
        if (!errors && parcel) {
          await localStorage.setItem(
            "parcel_id",
            parcel.id
          );
          window.location = await "../pages/SingleParcel.html";
          return;
        }
        if (errors.destination)
          destination.parentElement.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.destination}</p>`;
        if (errors.pickupLocation)
          pickupLocation.parentElement.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.pickupLocation}</p>`;
        if (errors.weight)
          weight.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.weight}</p>`;
        if (errors.quantity)
          quantity.parentElement.querySelector(
            ".errors"
          ).innerHTML = `<p>${errors.quantity}</p>`;
        return;
      });
    })
    .catch(err => {
      console.log(err);
    });
};
document
  .querySelector("#send-parcel")
  .addEventListener("click", saveParcel);

const clearErrors = () => {
  destination.parentElement.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;

  pickupLocation.parentElement.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  weight.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  quantity.parentElement.querySelector(
    ".errors"
  ).innerHTML = ``;
  return;
};
