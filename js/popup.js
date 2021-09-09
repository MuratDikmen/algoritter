document.getElementById("login-btn").style.backgroundColor = "green";
document.getElementById("login-btn").addEventListener("click", () => {
  window.open("http://localhost:5000/auth");
});
