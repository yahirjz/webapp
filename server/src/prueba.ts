import { firestore, rtdb } from "./db";

async function main() {
  try {
    // ------ 1. Prueba de Firestore ------
    console.log("🔥 Intentando escribir en Firestore...");

    const docRef = firestore.collection("test").doc("hola_mundo");

    //Escribimos los datos en firestore
    await docRef.set({ //* .set() es la función que escribe en la base de datos
        mensaje: "¡Conexión exitosa a Firestore!",
        fecha: new Date().toISOString()
    });
    console.log("✅ Escritura en Firestore exitosa.");

    //Leemos los datos de firestore que creamos anteriormente
    const docSnap = await docRef.get(); //* .get() va a la base de datos y trae los datos 
    console.log("📖 Leído de Firestore:", docSnap.data()); //* data() es la función que saca información del snapshot

    // ------ 2. Prueba de Realtime Database ------
    console.log("\n📡 Intentando escribir en Realtime Database...");
    const rtdbRef = rtdb.ref("test/hola_mundo");
    await rtdbRef.set({
        mensaje: "¡Conexión exitosa a RTDB!",
        fecha: new Date().toISOString()
    });
    console.log("✅ Escritura en RTDB exitosa.");
    
    const rtdbSnap = await rtdbRef.once("value");
    console.log("📖 Leído de RTDB:", rtdbSnap.val());

  } catch (error) {
    console.error("❌ Ocurrió un error:", error);
  }
}

main();