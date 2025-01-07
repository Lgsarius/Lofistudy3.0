# LofiStudy 3.0

A Lo-Fi themed productivity web app built with Next.js and Firebase, featuring a desktop-like environment with multiple productivity tools.

## Features

- 🎨 Lo-Fi themed UI with customizable themes and backgrounds
- 🔐 Authentication with email/password and Google sign-in
- ⏰ Pomodoro Timer for focused work sessions
- 🎵 Lo-Fi Music Player
- 📝 Markdown Notes Editor
- ⚙️ Customizable Settings
- 🖥️ Desktop-like environment with draggable and resizable windows

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Firebase Authentication
- Tailwind CSS
- Zustand for state management
- React Icons
- React Markdown

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lofistudy3.0.git
   cd lofistudy3.0
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password and Google providers)
   - Copy your Firebase configuration

4. Create a `.env.local` file in the root directory and add your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (auth)/            # Authentication pages (login, register)
│   └── app/               # Main application pages
├── components/            # React components
│   ├── apps/             # Application-specific components
│   ├── auth/             # Authentication components
│   ├── dock/             # Dock component
│   └── windows/          # Window management components
├── lib/                  # Utilities and configurations
│   ├── firebase/        # Firebase configuration
│   └── store/           # Zustand stores
```

## Customization

### Themes
You can add new themes by modifying the `themes` array in `src/components/apps/Settings.tsx`.

### Background Patterns
To add new background patterns:
1. Add your pattern images to the `public` directory
2. Update the `backgrounds` array in `src/components/apps/Settings.tsx`

### Lo-Fi Music
To add your own music tracks:
1. Update the `tracks` array in `src/components/apps/MusicPlayer.tsx`
2. Ensure you have the rights to use the music

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
