const cancelOrder = element => {
	element.parentElement.parentElement.hidden = true;
};

const showMenu = element => {
	let drpContent = document.getElementById("drp-conent");

	if (drpContent.style.display == "block") {
		element.innerHTML = `<img src="../assets/icons/down-arrow.svg" alt=">>" srcset="" class="md-icon">`;
		drpContent.style.display = "none";
	} else {
		element.innerHTML = `<img src="../assets/icons/up-arrow.svg" alt=">>" srcset="" class="md-icon">`;
		drpContent.style.display = "block";
	}
};
