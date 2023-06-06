// @ts-check
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

/** @type {HTMLFormElement}  */
// @ts-ignore

console.log("");

const form = document.getElementById("signupForm");
console.log(form);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;
  const name = form.name.value;

  console.log(email, password);
  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (!userCredentials) {
    console.log("Error creating user firebase");
    // TODO: Desplegar error al usuario
    return;
  }
  // set user name
  await updateProfile(auth.currentUser,{displayName: name});

  const idTokenGenerated = await userCredentials.user.getIdToken();

  const serverResponse = await fetch("/auth/sign_up", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      token_id: idTokenGenerated,
      name: name,
      email: email,
    }),
  });

  if (!serverResponse.ok) {
    console.log("Error in ");
    // TODO: Desplegar error al usuario
  }
});
