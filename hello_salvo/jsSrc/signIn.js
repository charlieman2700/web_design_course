// @ts-check
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const form = document.getElementById("loginForm");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;

  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  if (userCredential) {
    const result = await fetch("/auth/sign_in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Response-Type": "*",
      },
      body: JSON.stringify({
        email: email,
        token_id: userCredential.user.refreshToken,
      }),
    });
    console.log(result)
  }

});
