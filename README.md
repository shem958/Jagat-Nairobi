# Jagat Nairobi MVP

A real-time social map application for Nairobi. Features user location sharing and event pins on a live map.

## Project Structure

- `backend/` - NestJS API (Socket.io Gateway, MongoDB Mongoose Schemas, Firebase Admin Auth)
- `mobile/` - Flutter App (GoRouter, Riverpod, flutter_map with OpenStreetMap, Firebase Auth)

## Configuration & Environment Variables

### Backend
1. Go to `backend/`
2. Copy `.env.example` to `.env`
3. Update `.env` with:
   - `MONGO_URI` (your MongoDB connection string)
   - `JWT_SECRET` (A secure random string)
   - Follow instructions to add your Firebase Admin SDK JSON credentials.

### Mobile (Firebase Setup)
To configure Firebase for your Flutter app, run the FlutterFire CLI from the `mobile/` directory:
```bash
dart pub global activate flutterfire_cli
flutterfire configure --project="your-firebase-project-id"
```
This will generate `lib/firebase_options.dart`. Once generated, uncomment the `Firebase.initializeApp` code in `lib/main.dart`.

## Running Locally

### Backend
Make sure MongoDB is running locally or you have a cloud Atlas URI in `.env`.
```bash
cd backend
npm install
npm run start:dev
```

### Mobile
Ensure Developer Mode is enabled on Windows if testing locally. 
```bash
cd mobile
flutter run
```

## Note on Maps
OpenStreetMap is used via `flutter_map` instead of Google Maps, so no Google Maps API Key is required.
