// Script para leer un mensaje específico de la blockchain
const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');
const path = require('path');

// Dirección del mensaje que queremos leer
const MESSAGE_ADDRESS = 'Bs1rKNaGvwYiNsFUUGoAQHRed4M2PwbBzdC7mj8YkEoo';

// Cargamos el archivo IDL
const idl = JSON.parse(fs.readFileSync('./target/idl/anchor_program.json', 'utf8'));

// ID del programa
const programId = new PublicKey('75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c');

// Configuración de la conexión
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

// Creamos un proveedor y programa para leer datos
// Usamos una wallet dummy ya que solo vamos a leer datos (no se necesita firma)
const dummyWallet = new Wallet(Keypair.generate());
const provider = new AnchorProvider(connection, dummyWallet, { commitment: 'confirmed' });
const program = new Program(idl, programId, provider);

async function main() {
  try {
    console.log("Leyendo mensaje de la dirección:", MESSAGE_ADDRESS);
    
    // Convertimos la dirección string a PublicKey
    const messageAddress = new PublicKey(MESSAGE_ADDRESS);
    
    // Recuperamos los datos de la cuenta
    const messageAccount = await program.account.message.fetch(messageAddress);
    
    console.log("\n📝 Contenido del mensaje:");
    console.log("───────────────────────────────────────────");
    console.log("Mensaje:", messageAccount.content);
    console.log("Autor:", messageAccount.author.toString());
    console.log("Timestamp:", new Date(messageAccount.timestamp * 1000).toISOString());
    console.log("───────────────────────────────────────────");
    
    // Mostramos los datos raw para referencia
    const rawAccount = await connection.getAccountInfo(messageAddress);
    console.log("\nInformación adicional de la cuenta:");
    console.log("Propietario:", rawAccount.owner.toString());
    console.log("Lamports:", rawAccount.lamports);
    console.log("Tamaño de datos:", rawAccount.data.length, "bytes");
    
    // Link al explorador
    console.log("\nVerificar en el explorador:");
    console.log("https://explorer.solana.com/address/" + MESSAGE_ADDRESS + "?cluster=devnet");
    
  } catch (error) {
    console.error("Error al leer el mensaje:", error);
  }
}

main(); 