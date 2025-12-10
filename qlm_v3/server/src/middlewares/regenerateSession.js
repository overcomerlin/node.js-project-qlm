/**
 * Regenerates the session. This is used to prevent session fixation attacks.
 * The old session is destroyed and a new session is created with a new session ID.
 *
 * @param {import("express").Request} req The Express request object.
 * @param {function(import("express-session").Session): void} updater A function to update the new session.
 * @returns {Promise<void>}
 */
export async function regenerateSession(req, updater) {
  return new Promise((resolve, reject) => {
    // Keep a copy of the old session data.
    // Note: `req.session` is a class instance, not a plain object.
    // We only want to copy its own properties.
    const oldSession = req.session;

    const oldSessionData = Object.keys(oldSession).reduce((data, key) => {
      if (
        Object.prototype.hasOwnProperty.call(oldSession, key) &&
        key !== "cookie"
      ) {
        data[key] = oldSession[key];
      }
      return data;
    }, {});

    req.session.regenerate((err) => {
      if (err) return reject(err);
      // Copy old session data to the new session and apply updates.
      Object.assign(req.session, oldSessionData);
      if (typeof updater === "function") updater(req.session);
      resolve();
    });
  });
}
