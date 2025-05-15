# 🫒 4GroFlow: Olive Oil Supply Chain Tokenization

This project implements a decentralized application (dApp) on Solana for complete traceability of the olive oil supply chain. Each stage of the process (harvesting, pressing, packaging, transportation, etc.) is recorded as an asset or event on the blockchain, providing transparency and verifiability.

## 🔍 Overview

The ultimate goal is to create a complete traceability system for olive oil on the Solana blockchain. The application allows:

- Recording important process events on the blockchain
- Associating each event with a verified producer/user
- Creating an immutable and transparent supply chain history
- Verifying the authenticity and origin of the product

In this first iteration, we implement the basic functionality of "tokenizing a message" as a proof of concept.

## 🏗️ Project Structure

The project is divided into two main parts:

- **anchor-program/**: Solana program (on-chain side) developed with Anchor Framework
- **web-app/**: Frontend application developed with React + Vite (to be implemented)

## 🛠️ Technologies Used

- **Blockchain**: Solana
- **On-Chain Framework**: Anchor
- **Frontend**: React + TypeScript + Vite
- **Styling**: TailwindCSS
- **Wallet**: Backpack integration

## 📋 Requirements

- Node.js v16+
- Solana CLI v1.16+
- Anchor Framework v0.28+
- Backpack wallet installed in browser

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/4groflow-solana-supplychain.git
cd 4groflow-solana-supplychain
```

### 2. Install Anchor program dependencies

```bash
cd anchor-program
yarn install
```

### 3. Build the program

```bash
cargo build-sbf
anchor build
```

## 🧪 Testing the program

### Local tests

To run program tests in a local environment:

```bash
anchor test
```

### Interacting with the program on devnet

The program is already deployed on Solana devnet with ID: `75Y6LyCnaUGwWu7GyDkVTrYBdDw9USyYRkoqEx9Xd43c`

To create a message:

```bash
cd anchor-program
node test-devnet.js
```

To read an existing message:

```bash
cd anchor-program
node read-message.js
```

## 📝 Current Functionality

- **Create Message**: You can save a message on the blockchain associated with the signer's address.
- **Verification**: Validations are implemented to ensure messages don't exceed a certain size.
- **Timestamp**: Each message is saved with a timestamp of the creation moment.

## 🚧 Next Steps

1. [In development] Frontend with React + Vite
2. Backpack wallet integration
3. User interface improvement
4. Implementation of additional traceability functionalities

## 📊 Project Status

- ✅ Anchor Program (on-chain): Completed
- ⏳ Frontend: In development
- ⏳ Wallet integration: Pending
- ⏳ UI for program interaction: Pending

## 📄 License

This project is licensed under [specify license] 