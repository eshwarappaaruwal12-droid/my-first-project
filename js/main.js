/*
 * Site behaviour: mobile navigation toggle, footer year and contact form validation.
 * The validation helpers are pure functions so they can be unit-tested in Node.
 */
(function () {
  "use strict";

  var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var MIN_MESSAGE_LENGTH = 10;

  function isValidEmail(value) {
    return EMAIL_PATTERN.test(String(value || "").trim());
  }

  /**
   * Validate contact form values.
   * Returns an object mapping field names to error messages (empty when valid).
   */
  function validateContactForm(values) {
    var errors = {};
    var name = String(values.name || "").trim();
    var email = String(values.email || "").trim();
    var message = String(values.message || "").trim();

    if (!name) {
      errors.name = "Please enter your name.";
    }

    if (!email) {
      errors.email = "Please enter your email address.";
    } else if (!isValidEmail(email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!message) {
      errors.message = "Please enter a message.";
    } else if (message.length < MIN_MESSAGE_LENGTH) {
      errors.message = "Your message should be at least " + MIN_MESSAGE_LENGTH + " characters.";
    }

    return errors;
  }

  function initNavToggle(doc) {
    var toggle = doc.querySelector(".nav-toggle");
    var nav = doc.getElementById("site-nav");
    if (!toggle || !nav) return;

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });
  }

  function initYear(doc) {
    var year = String(new Date().getFullYear());
    doc.querySelectorAll(".js-year").forEach(function (el) {
      el.textContent = year;
    });
  }

  function initContactForm(doc) {
    var form = doc.getElementById("contact-form");
    if (!form) return;
    var status = doc.getElementById("form-status");
    var fields = ["name", "email", "message"];

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var values = {
        name: form.elements.name.value,
        email: form.elements.email.value,
        message: form.elements.message.value
      };
      var errors = validateContactForm(values);

      fields.forEach(function (field) {
        var input = form.elements[field];
        var errorEl = doc.getElementById(field + "-error");
        if (errors[field]) {
          input.setAttribute("aria-invalid", "true");
          errorEl.textContent = errors[field];
        } else {
          input.removeAttribute("aria-invalid");
          errorEl.textContent = "";
        }
      });

      var firstInvalid = fields.filter(function (f) { return errors[f]; })[0];
      if (firstInvalid) {
        // Centre the field so the sticky header doesn't cover it.
        form.elements[firstInvalid].focus({ preventScroll: true });
        form.elements[firstInvalid].scrollIntoView({ block: "center" });
        status.textContent = "Please fix the errors above.";
        status.className = "form-status is-error";
        return;
      }

      // This is a layout-only form: there is no backend, so just confirm and reset.
      status.textContent = "Thanks, " + values.name.trim() + "! Your message is ready to send.";
      status.className = "form-status is-success";
      form.reset();
    });
  }

  var api = {
    isValidEmail: isValidEmail,
    validateContactForm: validateContactForm,
    MIN_MESSAGE_LENGTH: MIN_MESSAGE_LENGTH
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  if (typeof document !== "undefined") {
    initNavToggle(document);
    initYear(document);
    initContactForm(document);
  }
})();
