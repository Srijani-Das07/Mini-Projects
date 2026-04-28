let slider = document.getElementById("length");
let lenValue = document.getElementById("lenValue");

slider.oninput = function () {
lenValue.innerText = this.value;
};

function generatePassword() {
let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
let lower = "abcdefghijklmnopqrstuvwxyz";
let number = "0123456789";
let symbol = "!@#$%^&*()_+";

let allChars = "";

if (document.getElementById("uppercase").checked) allChars += upper;
if (document.getElementById("lowercase").checked) allChars += lower;
if (document.getElementById("numbers").checked) allChars += number;
if (document.getElementById("symbols").checked) allChars += symbol;

if (allChars === "") {
alert("Select at least one option");
return;
}

let password = "";
let length = slider.value;

for (let i = 0; i < length; i++) {
password += allChars.charAt(Math.floor(Math.random() * allChars.length));
}

document.getElementById("password").value = password;

checkStrength(password);
}

function copyPassword() {
let pass = document.getElementById("password");
pass.select();
document.execCommand("copy");
alert("Password Copied!");
}

function checkStrength(password) {
let strength = document.getElementById("strength");

if (password.length < 8) {
strength.innerText = "Weak Password";
strength.style.color = "red";
}
else if (password.length < 12) {
strength.innerText = "Medium Password";
strength.style.color = "orange";
}
else {
strength.innerText = "Strong Password";
strength.style.color = "green";
}
}
