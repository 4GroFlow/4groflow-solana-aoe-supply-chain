import { useEffect, useState } from 'react';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import * as anchor from '@coral-xyz/anchor';
import { PublicKey, Keypair, SystemProgram } from '@solana/web3.js';
import { COMMITMENT } from '../constants/solana';

// Usar string directamente para evitar problemas
const PROGRAM_ID_STRING = "75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c";

// El IDL como objeto JavaScript simple
const IDL = {
  version: "0.1.0",
  name: "anchor_program",
  instructions: [
    {
      name: "createMessage",
      accounts: [
        {
          name: "message",
          isMut: true,
          isSigner: true
        },
        {
          name: "author",
          isMut: true,
          isSigner: true
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "content",
          type: "string"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "Message",
      type: {
        kind: "struct",
        fields: [
          {
            name: "author",
            type: "publicKey"
          },
          {
            name: "content",
            type: "string"
          },
          {
            name: "timestamp",
            type: "i64"
          }
        ]
      }
    }
  ]
};

// Tipo para los mensajes
type MessageAccount = {
  author: PublicKey;
  content: string;
  timestamp: number;
};

export const useAnchorProgram = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función de inicialización utilizando directamente el paquete anchor
  const initializeProgram = () => {
    if (!wallet) {
      console.log("No wallet connected");
      return null;
    }

    try {
      console.log("Wallet public key:", wallet.publicKey.toString());
      
      // Crear provider usando el método de la biblioteca anchor
      const provider = new anchor.AnchorProvider(
        connection,
        wallet,
        { commitment: COMMITMENT }
      );
      
      console.log("Provider created successfully");

      // Crear el objeto PublicKey a partir del string
      const programId = new PublicKey(PROGRAM_ID_STRING);
      console.log("PublicKey created:", programId.toString());

      // Intentamos con una aserción de tipo adicional
      console.log("Creating program with proper type assertions");
      const program = new anchor.Program(
        IDL as any,
        programId as any,
        provider as any
      );
      
      console.log("Program created successfully with ID:", program.programId.toString());
      return program;
    } catch (err) {
      console.error("Error initializing program:", err);
      return null;
    }
  };

  // Inicializar cuando el wallet cambia
  useEffect(() => {
    if (wallet) {
      console.log("Wallet connected, initializing...");
      const p = initializeProgram();
      if (p) {
        console.log("Successfully initialized program");
        setProgram(p);
        setError(null);
      } else {
        console.error("Failed to initialize program");
        setProgram(null);
        setError("Failed to initialize program");
      }
    } else {
      console.log("No wallet, clearing program");
      setProgram(null);
      setError(null);
    }
  }, [wallet, connection]);

  // Crear un mensaje
  const createMessage = async (content: string) => {
    console.log("Creating message with content:", content);
    
    // Reintentar la inicialización si es necesario
    if (!program && wallet) {
      console.log("Program not initialized, trying again");
      const p = initializeProgram();
      if (p) {
        console.log("Program initialized on-demand");
        setProgram(p);
      } else {
        setError("Could not initialize program");
        return null;
      }
    }
    
    if (!program || !wallet) {
      console.error("Program or wallet not available");
      setError("Wallet not connected or program not initialized");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Generar una nueva keypair para la cuenta del mensaje
      const message = Keypair.generate();
      console.log("Message keypair created:", message.publicKey.toString());
      
      // Enviar la transacción utilizando Anchor
      console.log("Sending transaction...");
      const tx = await program.methods
        .createMessage(content)
        .accounts({
          message: message.publicKey,
          author: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([message])
        .rpc();

      console.log("Transaction sent:", tx);

      // Recuperar el mensaje creado
      const messageAccount = await program.account.message.fetch(message.publicKey);
      console.log("Message account fetched:", messageAccount);

      setLoading(false);
      return {
        messageAccount,
        publicKey: message.publicKey,
        tx
      };
    } catch (err) {
      console.error("Error creating message:", err);
      setError(`Error creating message: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
      return null;
    }
  };

  // Recuperar mensajes
  const fetchMyMessages = async () => {
    if (!program || !wallet) {
      setError("Wallet not connected or program not initialized");
      return [];
    }

    setLoading(true);
    setError(null);

    try {
      const messages = await program.account.message.all([
        {
          memcmp: {
            offset: 8, // Skip discriminator
            bytes: wallet.publicKey.toBase58()
          }
        }
      ]);

      setLoading(false);
      return messages.map(({ account, publicKey }: { account: MessageAccount, publicKey: PublicKey }) => ({
        publicKey,
        account
      }));
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(`Error fetching messages: ${err instanceof Error ? err.message : String(err)}`);
      setLoading(false);
      return [];
    }
  };

  // Verificar si el programa está inicializado
  const isProgramInitialized = () => {
    return !!program;
  };

  return {
    program,
    loading,
    error,
    createMessage,
    fetchMyMessages,
    connected: !!wallet,
    isProgramInitialized
  };
}; 