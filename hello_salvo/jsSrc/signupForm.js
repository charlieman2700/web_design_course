// @ts-check
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const form =
  /** @type {HTMLFormElement } */
  (document.getElementById("signupForm"));
console.log(form);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = form.email.value;
  const password = form.password.value;
  // @ts-ignore
  const name = form.name.value;


  let userCredentials;
  console.log(email, password);
  try {
    userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    console.log("Error creating user firebase");
    window.alert(error);

    return;
  }
  // set user name
  // @ts-ignore
  await updateProfile(auth.currentUser, { displayName: name });

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
    window.alert("Error in server");
  }
});
