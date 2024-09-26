import * as admin from "firebase-admin";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const serviceAccount = require("../../firebase.json");
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export { admin };
