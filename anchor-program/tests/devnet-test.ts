import * as anchor from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";

// Definimos la interfaz para el tipo Message
interface Message {
  author: PublicKey;
  content: string;
  timestamp: anchor.BN;
}

// ID del programa desplegado en devnet
const programId = new PublicKey("75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c");

// Definimos una versión simplificada del IDL manualmente
const idl = {
  "version": "0.1.0",
  "name": "anchor_program",
  "instructions": [
    {
      "name": "createMessage",
      "accounts": [
        {
          "name": "message",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "author",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "content",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "message",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "author",
            "type": "publicKey"
          },
          {
            "name": "content",
            "type": "string"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "MessageTooLong",
      "msg": "El mensaje no puede exceder los 280 caracteres"
    }
  ]
};

describe("Test en Devnet", () => {
  // Configuración del provider para usar devnet
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  // Crear una instancia del programa usando el IDL y el programId
  const program = new anchor.Program(idl, programId, provider);
  
  console.log("ID del programa:", programId.toString());
  console.log("Wallet pública:", provider.wallet.publicKey.toString());

  it("Puede crear un mensaje en la blockchain de devnet", async () => {
    // Generar una nueva keypair para la cuenta del mensaje
    const message = Keypair.generate();
    const testMessage = "Aceitunas recién recolectadas en finca Los Olivos - test en devnet";

    console.log("Creando mensaje en devnet...");
    
    try {
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
      const messageAccount = await program.account.message.fetch(message.publicKey) as Message;
      
      console.log("Mensaje guardado en la blockchain:", messageAccount.content);
      console.log("Autor:", messageAccount.author.toString());
      console.log("Timestamp:", new Date(messageAccount.timestamp.toNumber() * 1000).toISOString());
      console.log("Link a la cuenta: https://explorer.solana.com/address/" + message.publicKey.toString() + "?cluster=devnet");
    } catch (error) {
      console.error("Error al crear el mensaje:", error);
      throw error;
    }
  });
}); 