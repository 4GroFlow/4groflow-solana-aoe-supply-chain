// Script para probar el programa en devnet
const { Connection, PublicKey, Keypair, SystemProgram } = require('@solana/web3.js');
const { Program, AnchorProvider, Wallet } = require('@coral-xyz/anchor');
const fs = require('fs');

// Cargamos el archivo IDL
const idl = JSON.parse(fs.readFileSync('./target/idl/anchor_program.json', 'utf8'));

// ID del programa en devnet
const programId = new PublicKey('75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c');

// Configuración del proveedor
const wallet = new Wallet(Keypair.fromSecretKey(
  Buffer.from(JSON.parse(fs.readFileSync(process.env.HOME + '/.config/solana/id.json', 'utf8')))
));

const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
const provider = new AnchorProvider(connection, wallet, { commitment: 'confirmed' });

// Creamos una instancia del programa
const program = new Program(idl, programId, provider);

async function main() {
  try {
    // Generamos una keypair para la cuenta de mensaje
    const message = Keypair.generate();
    const testMessage = "Test desde script: Aceitunas orgánicas procesadas - " + new Date().toISOString();

    console.log("Creando mensaje en devnet...");
    console.log("Mensaje a guardar:", testMessage);
    console.log("Cuenta del mensaje:", message.publicKey.toString());
    console.log("Autor (wallet):", wallet.publicKey.toString());

    // Enviamos la transacción
    const tx = await program.methods
      .createMessage(testMessage)
      .accounts({
        message: message.publicKey,
        author: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([message])
      .rpc();

    console.log("Transacción confirmada:", tx);
    console.log("Link a la transacción: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");

    // Recuperamos el mensaje de la blockchain para verificar
    console.log("Verificando mensaje...");
    const messageAccount = await program.account.message.fetch(message.publicKey);
    
    console.log("\nMensaje guardado correctamente:");
    console.log("Contenido:", messageAccount.content);
    console.log("Autor:", messageAccount.author.toString());
    console.log("Timestamp:", new Date(messageAccount.timestamp * 1000).toISOString());
    console.log("Link al mensaje: https://explorer.solana.com/address/" + message.publicKey.toString() + "?cluster=devnet");
    
  } catch (error) {
    console.error("Error al crear el mensaje:", error);
  }
}

main(); 