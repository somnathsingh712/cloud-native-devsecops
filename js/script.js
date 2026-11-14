const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const message = document.getElementById("formMessage");

        message.textContent =
            `Thank you, ${name}! Your message has been received in this demo.`;

        contactForm.reset();
    });
}
