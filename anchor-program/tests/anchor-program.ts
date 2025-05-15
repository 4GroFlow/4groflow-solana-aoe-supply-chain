import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorProgram } from "../target/types/anchor_program";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { expect } from "chai";

describe("Programa de Cadena de Suministro de Aceite", () => {
  // Configuración del provider para usar devnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Referencia al programa
  const program = anchor.workspace.AnchorProgram as Program<AnchorProgram>;
  
  // ID del programa en devnet
  console.log("ID del programa:", program.programId.toString());

  it("Puede crear un mensaje en la blockchain", async () => {
    // Generar una nueva keypair para la cuenta del mensaje
    const message = Keypair.generate();
    const testMessage = "Aceitunas recién recolectadas en finca Los Olivos - Lote #123";

    console.log("Creando mensaje en devnet...");
    
    // Ejecutar la instrucción create_message
    const tx = await program.methods
      .createMessage(testMessage)
      .accounts({
        message: message.publicKey,
        author: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([message])
      .rpc();
      
    console.log("Transacción confirmada:", tx);
    console.log("Link a la transacción: https://explorer.solana.com/tx/" + tx + "?cluster=devnet");

    // Recuperar la cuenta para verificar que el mensaje se almacenó correctamente
    const messageAccount = await program.account.message.fetch(message.publicKey);
    
    // Verificar que los datos son correctos
    expect(messageAccount.author.toString()).to.equal(provider.wallet.publicKey.toString());
    expect(messageAccount.content).to.equal(testMessage);
    
    // Verificar que el timestamp es un número mayor a 0
    expect(Number(messageAccount.timestamp.toString())).to.be.above(0);
    
    console.log("Mensaje guardado en la blockchain:", messageAccount.content);
    console.log("Autor:", messageAccount.author.toString());
    console.log("Timestamp:", new Date(Number(messageAccount.timestamp.toString()) * 1000).toISOString());
    console.log("Link a la cuenta: https://explorer.solana.com/address/" + message.publicKey.toString() + "?cluster=devnet");
  });

  it("No permite mensajes de más de 280 caracteres", async () => {
    // Generar una nueva keypair para la cuenta del mensaje
    const message = Keypair.generate();
    
    // Crear un mensaje que excede el límite de caracteres
    const longMessage = "a".repeat(281);

    try {
      // Intentar ejecutar la instrucción con un mensaje demasiado largo
      await program.methods
        .createMessage(longMessage)
        .accounts({
          message: message.publicKey,
          author: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([message])
        .rpc();
      
      // Si llegamos aquí, la prueba ha fallado
      expect.fail("La transacción debería haber fallado por el límite de caracteres");
    } catch (error) {
      // Verificar que el error contiene el mensaje esperado
      expect(error.message).to.include("MessageTooLong");
      console.log("Test exitoso: Se rechazó correctamente el mensaje largo");
    }
  });
});
