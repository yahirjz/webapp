import  * as admin from "firebase-admin";
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || "{}")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as any),
  databaseURL: "https://gameppt-5a53e-default-rtdb.firebaseio.com"
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };