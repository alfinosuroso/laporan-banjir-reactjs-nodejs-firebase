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


