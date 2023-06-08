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
  console.log(userCredential);

  let userToken;
  try {
    userToken = await auth.currentUser?.getIdToken();
    console.log(userToken);
  } catch (error) {
    alert(error.message);
    return;
  }

  console.log("enter method");
  const result = await fetch("/auth/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Response-Type": "*",
    },
    body: JSON.stringify({
      email: email,
      token_id: userToken,
    }),
  });
  console.log(result);
});
