export const findIndex = (parcels, id) => {
  if (!/^\+?(0|[1-9]\d*)$/.test(id)) {
    return null;
  }
  const parcel = parcels.find(item => item.id === parseInt(id, 10));
  const index = parcels.indexOf(parcel);
  if (index >= 0 && index < parcels.length) {
    return index;
  }
  return null;
};
