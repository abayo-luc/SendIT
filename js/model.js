//the model
const modal = document.getElementById("edit-model");

const openModel = () => {
	modal.style.display = "block";
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
