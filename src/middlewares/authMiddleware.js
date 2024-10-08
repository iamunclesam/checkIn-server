const JWT = require("jsonwebtoken");
const createError = require("http-errors");

module.exports = {
  signAccessToken: (userId, role) => {
    return new Promise((resolve, reject) => {
      const payload = { role };

      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: "1y", // Set expiration time to one hour
        issuer: "pickurpackage.com",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.error("Error signing access token:", err.message);
          reject(
            createError.InternalServerError("Failed to sign access token")
          );
        } else {
          resolve(token);
        }
      });
    });
  },

  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }

      req.payload = payload;
      next();
    });
  },

  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};

      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: "1y", // Set expiration time to one hour
        issuer: "pickurpackage.com",
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.error("Error signing access token:", err.message);
          reject(
            createError.InternalServerError("Failed to sign access token")
          );
        } else {
          resolve(token);
        }
      });
    });
  },

  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized());
          const userId = payload.aud;
          resolve(userId);
        }
      );
    });
  },
  isAdmin: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());

    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }


      if (payload.role !== "admin") {
        return next(createError.Forbidden("Admin role required."));
      }

      req.payload = payload;
      console.log(payload)
      next();
    });
  },
};
