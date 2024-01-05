function displayModal(photographerName) {
  const modal = document.getElementById("contact_modal");
  const overlay = document.getElementById("overlay");
  const modalTitle = modal.querySelector("h2");
  modalTitle.textContent = `Contactez-moi ${photographerName}`;
  modal.style.display = "block";
  overlay.style.display = "block";
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById("firstname").focus();
  trapFocus(modal);
}


function closeModal() {
    const modal = document.getElementById("contact_modal");
    const overlay = document.getElementById("overlay");
    modal.style.display = "none";
    overlay.style.display = "none"; // Masquer l'overlay
    modal.setAttribute('aria-hidden', 'true');
    document.querySelector(".contact_button").focus();
}

function trapFocus(element) {
  const focusableElements = element.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstFocusableElement = focusableElements[0];
  const lastFocusableElement = focusableElements[focusableElements.length - 1];

  document.addEventListener('keydown', function(e) {
      let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

      if (!isTabPressed) {
          return;
      }

      if (e.shiftKey) { // Si Maj + Tab
          if (document.activeElement === firstFocusableElement) {
              lastFocusableElement.focus();
              e.preventDefault();
          }
      } else { // Si Tab
          if (document.activeElement === lastFocusableElement) {
              firstFocusableElement.focus();
              e.preventDefault();
          }
      }
  });
}

// Gestion de la touche Échap pour fermer la modal
window.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
      closeModal();
  }
});

document.getElementById('modal_contact_button').addEventListener('click', (e) => {
  e.preventDefault();

  const inputs = document.querySelectorAll('#contact_modal input');
  inputs.forEach(input => {
      console.log(`${input.name}: ${input.value}`);
  });
});
