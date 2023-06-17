// @ts-check
import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const form = document.getElementById("loginForm");
// @ts-ignore
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // @ts-ignore
  const email = form.email.value;
  // @ts-ignore
  const password = form.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    alert(error.message);
    // @ts-ignore
    form.email.value = "";
    // @ts-ignore
    form.password.value = "";
    return;
  }

  let userToken;
  try {
    userToken = await auth.currentUser?.getIdToken();
    console.log(userToken);
  } catch (error) {
    alert(error.message);
    return;
  }

  const result = await fetch("/auth/sign_in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Response-Type": "*",
    },
    body: JSON.stringify({
      token_id: userToken,
    }),
  });

  if (result.ok) {
    window.location.href = "/";
  }

});
