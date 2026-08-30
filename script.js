let menu = document.querySelector("#menu-icons");
let navlist = document.querySelector(".navlist");

// Animasi buka tutup navbar (hamburger menu)
menu.onclick = () => {
  menu.classList.toggle("bx-x");
  navlist.classList.toggle("open");
};

// Menutup menu secara otomatis jika halaman di scroll
window.onscroll = () => {
  menu.classList.remove("bx-x");
  navlist.classList.remove("open");
};

// Menutup menu jika item navbar diklik (khusus versi mobile)
document.querySelectorAll(".navlist a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("bx-x");
    navlist.classList.remove("open");
  });
});
