const navLinks = document.getElementsByClassName("nav-link");
for (let link of navLinks) {
  if (window.location.pathname == link.attributes.href.value) {
    if (!link.classList.contains("active")) link.classList.add("active");
  } else link.classList.remove("active");
}
