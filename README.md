# Real-time Chat Frontend

Modern Next.js 14 frontend with real-time WebSocket messaging, JWT authentication, and responsive UI.

## 🚀 Features

- **Real-time Messaging** - WebSocket-based instant messaging
- **JWT Authentication** - Secure token-based auth with auto-refresh
- **Responsive Design** - Mobile-friendly Tailwind CSS UI
- **User Search** - Find and start conversations with other users
- **Message History** - Load and display previous messages
- **TypeScript** - Full type safety
- **Auto-scroll** - Automatically scrolls to new messages
- **Duplicate Prevention** - Smart message deduplication
- **Cookie-based Storage** - Secure token storage

## 📋 Requirements

- Node.js 18+
- npm or yarn
- Backend API running on http://localhost:8000

## 🛠️ Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install
# or
yarn install

# Create environment file
cp .env.example .env.local

# Start development server
npm run dev
# or
yarn dev

# Open browser
# http://localhost:3000
```

## 📦 Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "axios": "^1.6.0",
    "js-cookie": "^3.0.5",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0"
  },
  "devDependencies": {
    "@types/js-cookie": "^3.0.6",
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0"
  }
}
```

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws/
```

### Next.js Configuration

`next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
```

## 📱 Pages & Routes

### Public Routes

- `/` - Landing page
- `/login` - User login
- `/register` - User registration

### Protected Routes (Require Authentication)

- `/dashboard` - User profile management
- `/conversations` - Chat conversations list
- `/chat/[id]` - Individual chat room

## 🎨 UI Components

### Landing Page (`/`)

- Welcome screen
- Login and Register buttons
- Gradient background

### Login Page (`/login`)

- Username and password fields
- Error handling
- Redirect to dashboard on success
- Link to registration

### Register Page (`/register`)

- Username, email, password fields
- Password confirmation
- Form validation
- Automatic login after registration

### Dashboard (`/dashboard`)

- User profile display
- Edit profile functionality
- Messages button to conversations
- Logout button

### Conversations List (`/conversations`)

- List of all conversations
- Last message preview
- Timestamps (relative time)
- New Chat button
- User search modal
- Click to open chat

### Chat Room (`/chat/[id]`)

- Real-time message display
- Message input field
- User avatar and info
- Auto-scroll to bottom
- Back to conversations button
- Message timestamps

## 🔌 API Integration

### Authentication Service (`lib/auth.ts`)

```typescript
authService.register(data); // Register new user
authService.login(data); // Login user
authService.logout(); // Logout user
authService.getProfile(); // Get user profile
authService.updateProfile(data); // Update profile
authService.isAuthenticated(); // Check auth status
```

### Chat Service (`lib/chat.ts`)

```typescript
chatService.getConversations(); // Get all conversations
chatService.createConversation(userId); // Create/get conversation
chatService.getConversationMessages(id, limit); // Get message history
chatService.searchUsers(query); // Search users
chatService.deleteConversation(id); // Delete conversation
chatService.connectWebSocket(id); // Connect to WebSocket
```

## 🔐 Authentication Flow

1. User logs in → JWT tokens stored in cookies
2. API requests include `Authorization: Bearer {token}`
3. Token refresh on 401 errors
4. Auto-logout on refresh failure
5. Protected routes check authentication

## 💬 WebSocket Integration

### Connection

```typescript
const ws = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/?token=${accessToken}`);
```

### Sending Messages

```typescript
ws.send(
  JSON.stringify({
    message: "Hello, World!",
  })
);
```

### Receiving Messages

```typescript
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  // Handle incoming message
};
```

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS for styling with custom configurations:

- **Colors**: Blue primary, Red for logout/delete
- **Responsive**: Mobile-first design
- **Components**: Buttons, inputs, cards, modals
- **Utilities**: Flexbox, Grid, Spacing

### Key Design Patterns

```css
/* Primary Button */
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700;
}

/* Input Field */
.input-field {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md 
         focus:outline-none focus:ring-2 focus:ring-blue-500;
}

/* Message Bubble */
.message-sent {
  @apply bg-blue-600 text-white rounded-lg px-4 py-2;
}

.message-received {
  @apply bg-white text-gray-900 rounded-lg px-4 py-2;
}
```

## 📂 Project Structure

```
frontend/
├── app/
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── register/
│   │   └── page.tsx            # Register page
│   ├── dashboard/
│   │   └── page.tsx            # User dashboard
│   ├── conversations/
│   │   └── page.tsx            # Conversations list
│   └── chat/
│       └── [id]/
│           └── page.tsx        # Chat room
├── lib/
│   ├── api.ts                  # Axios configuration
│   ├── auth.ts                 # Auth service
│   └── chat.ts                 # Chat service
├── public/                     # Static assets
├── next.config.js              # Next.js config
├── tsconfig.json               # TypeScript config
└── package.json                # Dependencies
```

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint

# Type check
npx tsc --noEmit

```

## 🚀 Production Deployment

### Build

```bash
# Create production build
npm run build

# Start production server
npm run start
```

### Deployment Platforms

#### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables for Production

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NEXT_PUBLIC_WS_URL=wss://api.yourdomain.com
```

## 🐛 Troubleshooting

### Hydration Errors

Add `suppressHydrationWarning` to `<html>` tag:

```tsx
<html lang="en" suppressHydrationWarning>
```

### WebSocket Connection Failed

1. Check backend is running with Daphne
2. Verify WebSocket URL is correct
3. Ensure JWT token is valid
4. Check CORS settings on backend

### Authentication Issues

```bash
# Clear cookies and local storage
# In browser console:
document.cookie.split(";").forEach(c => {
  document.cookie = c.trim().split("=")[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/';
});
localStorage.clear();
```

### API Connection Issues

1. Verify backend is running on port 8000
2. Check CORS settings
3. Inspect Network tab in browser DevTools
4. Verify API URLs in environment variables

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators
- Color contrast compliance

## 🔒 Security

- JWT tokens in HTTP-only cookies (recommended for production)
- XSS protection via React
- CSRF protection
- Input validation
- Secure WebSocket connections (WSS in production)

## 📊 Performance

- Server-side rendering (SSR)
- Automatic code splitting
- Image optimization
- Lazy loading
- WebSocket connection pooling

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

## 📄 License

MIT License

## 📧 Support

For issues and questions, please open an issue on GitHub.
