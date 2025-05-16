# 🫒 4GroFlow: Olive Oil Supply Chain Tokenization

This project implements a decentralized application (dApp) on Solana for complete traceability of the olive oil supply chain. Each stage of the process (harvesting, pressing, packaging, transportation, etc.) is recorded as an asset or event on the blockchain, providing transparency and verifiability.

## 🔍 Overview

The ultimate goal is to create a complete traceability system for olive oil on the Solana blockchain. The application allows:

- Recording important process events on the blockchain
- Associating each event with a verified producer/user
- Creating an immutable and transparent supply chain history
- Verifying the authenticity and origin of the product

One of the main objectives of 4GroFlow is to provide **open source code** to facilitate the creation of more food traceability tools in the **Solana** ecosystem. We believe that transparency in the food supply chain should be accessible to all producers and consumers.

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
- **Wallet**: Backpack and Phantom integration

## 📋 Requirements

- Node.js v24+
- Solana CLI v1.18+
- Anchor Framework v0.29+
- Backpack or Phantom wallet installed in browser

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
```

Note: Use `cargo build-sbf` instead of `anchor build` as newer versions of Solana CLI have updated the SBF compiler naming.

## 🧪 Testing the program

### Local tests

To run program tests in a local environment, you need to properly configure the environment variables. Use the following steps:

1. **Compile the program**:
```bash
cd anchor-program
cargo build-sbf
```

2. **Configure environment variables**:
```bash
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com
export ANCHOR_WALLET=/path/to/your/wallet.json
```
Note: Adjust the wallet path as needed. Default location is usually `~/.config/solana/id.json`.

3. **Run the tests**:
```bash
yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
```

You can also run all steps in one command:
```bash
cd anchor-program && \
cargo build-sbf && \
export ANCHOR_PROVIDER_URL=https://api.devnet.solana.com && \
export ANCHOR_WALLET=~/.config/solana/id.json && \
yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts
```

This will execute three test cases:
- Creating a message on the blockchain
- Verifying message size validation (max 280 characters)
- Testing functionality on devnet

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
- **Wallet Integration**: Support for both Backpack and Phantom wallets for transaction signing.

## 🚧 Next Steps

1. [In development] Frontend with React + Vite
2. Complete wallet integration with Backpack and Phantom
3. User interface improvement
4. Implementation of additional traceability functionalities

## 📊 Project Status

- ✅ Anchor Program (on-chain): Completed
- ⏳ Frontend: In development
- ⏳ Wallet compatibility: Backpack and Phantom supported
- ⏳ UI for program interaction: In development

## 📄 License

This project is licensed under the MIT License