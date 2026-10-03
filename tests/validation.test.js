const test = require("node:test");
const assert = require("node:assert/strict");
const { isValidEmail, validateContactForm, MIN_MESSAGE_LENGTH } = require("../js/main.js");

test("isValidEmail accepts well-formed addresses", () => {
  assert.equal(isValidEmail("me@example.com"), true);
  assert.equal(isValidEmail("  first.last+tag@sub.example.org  "), true);
});

test("isValidEmail rejects malformed addresses", () => {
  for (const bad of ["", "plain", "no-at.example.com", "a@b", "a @b.com", "@example.com", null, undefined]) {
    assert.equal(isValidEmail(bad), false, `expected ${JSON.stringify(bad)} to be invalid`);
  }
});

test("validateContactForm returns no errors for valid input", () => {
  const errors = validateContactForm({
    name: "Ada",
    email: "ada@example.com",
    message: "Hello there, nice site!"
  });
  assert.deepEqual(errors, {});
});

test("validateContactForm requires all fields", () => {
  const errors = validateContactForm({});
  assert.deepEqual(Object.keys(errors).sort(), ["email", "message", "name"]);
});

test("validateContactForm treats whitespace-only values as empty", () => {
  const errors = validateContactForm({ name: "   ", email: " ", message: "\n\t" });
  assert.match(errors.name, /enter your name/);
  assert.match(errors.email, /enter your email/);
  assert.match(errors.message, /enter a message/);
});

test("validateContactForm flags an invalid email", () => {
  const errors = validateContactForm({ name: "Ada", email: "not-an-email", message: "Long enough message" });
  assert.deepEqual(Object.keys(errors), ["email"]);
  assert.match(errors.email, /valid email/);
});

test("validateContactForm enforces a minimum message length", () => {
  const short = "x".repeat(MIN_MESSAGE_LENGTH - 1);
  const exact = "x".repeat(MIN_MESSAGE_LENGTH);
  assert.ok(validateContactForm({ name: "A", email: "a@b.co", message: short }).message);
  assert.equal(validateContactForm({ name: "A", email: "a@b.co", message: exact }).message, undefined);
});
