const toggleBtn = document.getElementById("themeToggle");
const body = document.body;

// Toggle dark/light mode
toggleBtn.addEventListener("click", () => {
    body.classList.toggle("dark");
    body.classList.toggle("light");

    toggleBtn.textContent = body.classList.contains("dark") 
        ? "Light Mode" 
        : "Dark Mode";
});

const form = document.getElementById("bmiForm");
const resultl = document.getElementById("result");

form .addEventListener("submit", function(event) {
	event.preventDefault();
	console.log("Form Submitted");

	const weight=parseFloat(document.getElementById("weight").value);
	const height=parseFloat(document.getElementById("heightCM").value);

	console.log("Weight entered in kg: ",weight);
	console.log("Height entered in cm: ",height);

	if (!weight || !height) {
		resultl.textContent = "Please enter valid numbers.";
        	resultl.classList.remove("show");
        	setTimeout(() => resultl.classList.add("show"), 50);
        	return;
	}
	if (weight <= 0 || height <= 0 || weight > 500 || height > 300) {
    		resultl.textContent = "Please enter realistic values.";
		resultl.classList.remove("show");
        	setTimeout(() => resultl.classList.add("show"), 50);
    		return;
	}

	const heightM=height/100;
	console.log("Height converted to meters: ", heightM);

	const bmi=weight/(heightM * heightM);
	console.log("BMI Value: ",bmi);

	let category = "";
	let color;
	if (bmi<18.5) {category="Underweight"; color="blue";}
	else if (bmi<25) {category="Normal"; color="green";}
	else if (bmi<30) {category="Overweight"; color="orange";}
	else {category="Obese";color="red";}
	resultl.style.color=color;
	console.log("Category: ",category);

	resultl.textContent= `Your BMI is ${bmi.toFixed(1)} (${category})`;
	console.log("Result displayed on page");
	
	resultl.classList.remove("show");
    	setTimeout(() => resultl.classList.add("show"), 50);	


});
