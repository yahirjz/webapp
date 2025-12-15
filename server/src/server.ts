import express from "express";
import cors from "cors";
import path from "path";
import { firestore, rtdb } from "./db";
import crypto from "crypto";
import "dotenv/config";

import fs from "fs";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

//collections
const userCollection = firestore.collection("users");
const gameRoomsCollection = firestore.collection("gameRooms");

// ---- new player -----
app.post("/player", async (req,res) => {
    const { name } = req.body;
    const search = await userCollection.where("name", "==",name).get()

    if(search.empty){
        //Esto es lo que mandamos a la base de datos
        const newPlayer = await userCollection.add({
            name,
            timestamp: new Date()
        });
        //Esto es lo que mandamos al cliente
        res.status(201).json({
            id: newPlayer.id,
            message: "Player created"
        });
    }else{
        res.status(200).json({
             id: search.docs[0].id,
             message: "Player found"
        }); 
    }

});

// ---- endpoint de creación de salas ----
app.post("/gamerooms", async (req, res) => {
    const { userId } = req.body;

    const doc = await userCollection.doc(userId.toString()).get();
    
    if (doc.exists) {
        
        const roomRef = rtdb.ref("rooms/" + crypto.randomUUID()); 

        await roomRef.set({
            messages: [],
            owner: userId,
            playerOne: userId,
            playerTwo: "",
             score : {
                    playerOne: 0,
                    playerTwo: 0,
                },
        });

        const roomLongId = roomRef.key;
        const roomShortId = generateRoomId();
        
        await gameRoomsCollection.doc(roomShortId).set({
            rtdbRoomId: roomLongId,
            owner: userId
        });

        res.status(201).json({
            id: roomShortId,
            message: "Room created"
        });

    } else {
        res.status(401).json({
            message: "User not found"
        });
    }
});

//---- endpoint de búsqueda de salas ----
app.get("/gamerooms/:roomId", (req, res) =>{
    const { roomId } = req.params;
    const { userId } = req.query;

    if(!userId){
        return res.status(401).json({
            "message": "User not found"
        });
    }
    userCollection.doc(userId.toString()).get().then(doc => {
        if(doc.exists){
            gameRoomsCollection.doc(roomId.toString())
            .get()
            .then(snap => {
                // Primero verificamos si existe la sala
                if(!snap.exists){
                    return res.status(401).json({
                        error: "Room not found"
                    })
                }
                const data = snap.data(); //snap.data() es el documento que traemos de la base de datos
                
                // Accedemos a la RTDB para ver el estado actual de la sala
                const roomRef = rtdb.ref("rooms/" + data?.rtdbRoomId);

                roomRef.get().then(snapRTDB => {
                    const roomRTDB = snapRTDB.val();
                    // si está vacío el lugar 2 y no es el player 1
                    if(roomRTDB.playerTwo === "" && userId != roomRTDB.playerOne){
                        //lo ocupamos
                        roomRef.update({playerTwo: userId})
                        console.log(' Usuario ${userId} asignado como player 2');
                    }
                })
                res.json(data);
            });
        }else{
            res.status(401).json({
                error: "Room not found"
            })
        }
    })
})



const distPath = path.resolve(__dirname, "../public");

app.use(express.static(distPath));


app.get(/.*/, (req, res) => {
    const indexPath = path.resolve(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.error("❌ index.html not found at:", indexPath);
        res.status(404).send("Frontend not found. Check server logs.");
    }
});

app.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server runnning on http://0.0.0.0:${port}`);
})


// ---- Utils ----
function generateRoomId() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    
    // Función auxiliar para elegir uno al azar
    const getRandom = (str: string) => str[Math.floor(Math.random() * str.length)];
    
    // Retorna: Numero + Numero + Letra + Letra + Numero + Numero
    return getRandom(nums) + getRandom(nums) + 
           getRandom(chars) + getRandom(chars) + 
           getRandom(nums) + getRandom(nums);
}