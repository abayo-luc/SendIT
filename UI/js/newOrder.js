//get all forms with order-form class
let orderForms = [...document.getElementsByClassName("order-form")];

//get the progressbar's chrildren => steps
let steps = [...document.getElementById("progressbar").children];

const nextOrPrev = action => {
	//get the current form's index
	let activeIndex = orderForms.indexOf(
		orderForms.find(form => form.classList.contains("active"))
	);

	//filter steps, to get only activated one.
	let activeSteps = steps.filter(step => step.classList.contains("active"));
	//desactivate the current form, and activate the next one
	orderForms[activeIndex].classList.remove("active");

	// manupulate the next or pevious form and step

	switch (action) {
		case "next":
			orderForms[activeIndex + 1].classList.add("active");
			steps[activeSteps.length].classList.add("active");
			break;
		case "prev":
			orderForms[activeIndex - 1].classList.add("active");
			steps[activeSteps.length - 1].classList.remove("active");
		default:
			return null;
	}
};
