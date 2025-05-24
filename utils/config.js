const { JWT_SECRET = "dev-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};

// const JWT_SECRET = "some-secret-key";

// module.exports = { JWT_SECRET };
