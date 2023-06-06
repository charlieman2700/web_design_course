// @ts-check
//
import { auth } from "./firebase";

const loggedUser = auth.currentUser;

let actualToken;
if (loggedUser == null) {
  actualToken = "notLogged";
} else {
  actualToken = await loggedUser?.getIdToken();
}

window.addEventListener("DOMContentLoaded", function () {
  var links = document.getElementsByTagName("a");

  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", async function (event) {
      event.preventDefault(); // Prevent default link behavior
      var url = this.href;
      var body = JSON.stringify({
        token: actualToken,
      });

      await fetch(url, {
        method: "POST",
        body: body,
      });
    });
  }
});
