# Anti-Drug Campaign Mobile App

A mobile application designed to help combat drug abuse through anonymous reporting and community engagement.

## Features

- Anonymous report submission with end-to-end encryption
- Role-based access control for authorities
- User-friendly interface for easy reporting
- Optional photo/audio attachment support
- Automatic report categorization
- Secure communication channels
- Real-time notifications for authorities

## Tech Stack

- React Native (Frontend)
- Node.js with Express (Backend)
- MongoDB (Database)
- Firebase (Authentication & Push Notifications)
- CryptoJS (End-to-end encryption)

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on Android/iOS:
```bash
npm run android
# or
npm run ios
```

## Project Structure

```
anti-drug-app/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API and encryption services
│   ├── utils/          # Helper functions
│   └── assets/         # Images and other static files
├── backend/            # Server-side code
└── docs/              # Documentation
```

## Security Features

- End-to-end encryption for all reports
- Secure authentication system
- Role-based access control
- Data anonymization
- Secure file uploads

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE.md file for details