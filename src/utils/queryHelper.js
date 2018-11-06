export const findIndex = (parcels, id) => {
  const parcel = parcels.find(item => item.id === parseInt(id, 10));
  const index = parcels.indexOf(parcel);
  if (index >= 0 && index < parcels.length) {
    return index;
  }
  return null;
};

export const otherFunc = () => null;
