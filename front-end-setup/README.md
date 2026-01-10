# bstc-messenger-app
This repository contains code for text messenger app with a modern edge for BSTC.

## Tech Stack:
- Backend : Java
- Frontend : Electron + React.js

### Frontend project tree:
```
bstc-messenger-app/
├── electron/
│   ├── main/          # Main process (windows, IPC, native features)
│   ├── preload/       # Secure bridge between main and renderer
│   └── vite.config.ts # Electron-specific Vite config
├── src/               # Your React code (renderer process)
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── public/            # Static assets
├── index.html         # Entry HTML
└── package.json
```

#### How to run frontend app:
Use the command in the frontend directory : ```npm start```

To checkout all available commands, see 'scripts' in package.json.