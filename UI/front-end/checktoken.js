(async () => {
  const token = await localStorage.getItem("token");
  const user = localStorage.getItem("user");
  if (token && user) {
    return;
  } else {
    return (window.location = "/login");
  }
})();
