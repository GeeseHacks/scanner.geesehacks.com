# GeeseHacks Scanner

A mobile-first web application for managing hacker registrations and event check-ins at GeeseHacks. This application allows organizers to:

- Link hacker profiles with their badge QR codes
- Track event attendance through QR code scanning
- Manage and verify hacker check-ins in real-time

## Features

- Mobile-optimized interface for easy scanning
- QR code generation and scanning capabilities
- Real-time attendance tracking
- Secure hacker profile management
- Event check-in system

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technology Stack

- [Next.js](https://nextjs.org/) - React framework for production
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [QR Code Scanner](https://github.com/mebjas/html5-qrcode) - For badge scanning

## Development

The application is built with a mobile-first approach, ensuring optimal performance and user experience on mobile devices. The main components are:

- `app/page.tsx` - Main scanner interface
- `app/api/` - Backend API routes for data management
- `components/` - Reusable UI components

## Deployment

This application is deployed on [Vercel](https://vercel.com). The deployment is automatically handled through GitHub integration.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is proprietary and confidential. All rights reserved.
