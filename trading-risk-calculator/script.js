function calculate() {
  let capital = document.getElementById("capital").value;
  let risk = document.getElementById("risk").value;

  let loss = (capital * risk) / 100;

  document.getElementById("result").innerText =
    "Max Loss: ₹" + loss;
}
