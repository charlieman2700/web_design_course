const isActive = false;

const userDropdown = document.getElementById("userDropdownMenu");

function toggleUserDropDownVisibility() {
  isActive = !isActive;
  if (isActive) {
    userDropdown.classList = "visible";
  } else {
    userDropdown.classList = "invisible";
  }
}
