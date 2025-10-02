const $string = (str) => {
  return typeof str === "string" && str.trim().length > 0;
};

const $email = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const $password = (password) =>
  typeof password === "string" && password.length >= 6;

module.exports = { $string, $email, $password };
