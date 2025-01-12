# Laporan Banjir - ReactJS, NodeJS, Firebase App

This project is a full-stack application that uses ReactJS for the frontend, NodeJS for the backend, and Firebase for database management (Firestore).

## Features

- **Frontend**: ReactJS
- **Backend**: NodeJS, Express
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth

## Prerequisites

- [Node.js](https://nodejs.org/) installed
- [Firebase CLI](https://firebase.google.com/docs/cli) installed and initialized
- Service Account Key from Firebase for server-side operations

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/alfinosuroso/laporan-banjir-reactjs-nodejs-firebase.git
cd laporan-banjir-reactjs-nodejs-firebase

### 2. Frontend Setup

cd laporan-banjir-reactjs-firebase
npm install
npm run dev

### 3. Backend Setup
cd backend-nodejs-firebase
npm install
node ./src/app.js

### 4. Firebase setup
firebase console (create project)
firebase init (choose firestore)

Update the Firebase config in the frontend (frontend/src/firebaseConfig.js) and the Firebase service account key in the backend (backend/src/firebaseAdminConfig.json) with your own Firebase project details.

### Screenshot Image
![register](https://github.com/user-attachments/assets/52b171d8-6ccc-4a56-a2cb-c53a186b48cd)
![login](https://github.com/user-attachments/assets/b06c3478-9e2b-41b0-bf64-e8c312d2343c)
![dashboard](https://github.com/user-attachments/assets/ca616774-a357-482d-8648-ef16f0f0dd15)
![create-report](https://github.com/user-attachments/assets/1d3c0a6b-901a-4a36-a4b9-b59a242a9589)
![user-report](https://github.com/user-attachments/assets/00c229d4-7655-4ebe-9ef4-dc6d36759924)
![delete-report](https://github.com/user-attachments/assets/803a9b63-b4f0-4776-a9df-700aef204c2a)




