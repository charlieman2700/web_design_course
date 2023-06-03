import {auth} from './firebase';
import {createUserWithEmailAndPassword} from 'firebase/auth';

const form: HTMLFormElement = document.getElementById(
  'signupForm'
) as HTMLFormElement;

form.addEventListener('submit', async event => {
  event.preventDefault();
  const email = form.email.value;
  const password = form.password.value;

  console.log(email, password);
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    userCredentials;
  } catch (error) {
    /*
     * TODO: Handle errors, show the user something went wrong.
     * Not only a try catch but different errors for different cases.
     */

    console.log(error);
  }
});
