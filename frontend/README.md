# Translation Frontend

Modern Next.js frontend for the multi-language translation application.

## Features

- 🎨 Beautiful, responsive UI with Tailwind CSS
- 🌓 Dark mode support
- ⚡ Fast and optimized with Next.js 14
- 📱 Mobile-friendly design
- 🔄 Swap languages functionality
- 📋 Copy to clipboard
- ⌨️ Real-time character count
- 🎯 Type-safe with TypeScript

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React** - UI library

## Setup

### Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local`:
```bash
BACKEND_URL=http://localhost:8000
```

3. Run development server:
```bash
npm run dev
```

Visit http://localhost:3000

### Production Build

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t translation-frontend .
docker run -p 3000:3000 -e BACKEND_URL=http://backend:8000 translation-frontend
```

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx              # Main translation page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   └── api/
│       └── translate/
│           └── route.ts      # API route
├── components/
│   ├── LanguageSelector.tsx  # Language dropdown
│   ├── TranslationBox.tsx    # Text area component
│   └── SwapButton.tsx        # Swap languages button
├── public/                   # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Components

### LanguageSelector
Dropdown component for selecting languages.

**Props:**
- `value` - Selected language code
- `onChange` - Callback when language changes
- `languages` - Array of language objects
- `disabled` - Disable the selector
- `label` - Label text

### TranslationBox
Text area component for input/output.

**Props:**
- `value` - Text value
- `onChange` - Callback when text changes
- `placeholder` - Placeholder text
- `readOnly` - Make read-only
- `label` - Label text
- `maxLength` - Maximum character length

### SwapButton
Button to swap source and target languages.

**Props:**
- `onClick` - Callback when clicked
- `disabled` - Disable the button

## API Integration

The frontend communicates with the backend through Next.js API routes:

```typescript
// app/api/translate/route.ts
POST /api/translate
```

This proxies requests to the Python backend at `BACKEND_URL/translate`.

## Environment Variables

- `BACKEND_URL` - Backend API URL (required)

## Styling

### Dark Mode
Dark mode is automatically detected from system preferences and can be toggled manually.

### Tailwind Configuration
Custom configuration in `tailwind.config.js` with dark mode support.

### Custom Styles
Additional styles in `app/globals.css`.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Features Implementation

### Translation Flow
1. User enters text in source box
2. Selects source and target languages
3. Clicks "Translate" button
4. Request sent to Next.js API route
5. API route forwards to Python backend
6. Response displayed in target box

### Language Swap
Clicking swap button:
1. Swaps source and target languages
2. Moves translated text to source box
3. Moves source text to target box

### Copy to Clipboard
Uses the Clipboard API to copy translated text.

### Error Handling
- Network errors
- Backend unavailable
- Invalid input
- Translation failures

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Performance

### Optimizations
- Next.js App Router for optimal loading
- Component code splitting
- Image optimization
- Font optimization
- CSS purging with Tailwind

### Lighthouse Scores
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus indicators

## License

MIT License
