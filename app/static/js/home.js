// Dropdown toggle
const dropbtn = document.querySelector('.dropbtn');
const dropdown = document.querySelector('.dropdown-content');
const arrow = document.querySelector('.arrow');

dropbtn.addEventListener('click', () => {
    dropdown.classList.toggle('show');
    arrow.classList.toggle('rotated');
});

// Close dropdown if clicked outside
window.addEventListener('click', function(e) {
    if (!e.target.closest('.dropdown')) {
    dropdown.classList.remove('show');
    arrow.classList.remove('rotated');
    }
});