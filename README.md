# Modern Landing Page

A modern, responsive landing page built with Next.js 14+ (App Router), React, and Tailwind CSS.

## Features

- ✅ Next.js 14+ with App Router
- ✅ Tailwind CSS for styling
- ✅ Mobile-first, fully responsive design
- ✅ Sticky navigation header
- ✅ Hero section with image slider (3 slides)
- ✅ Auto-play slider (5 seconds interval)
- ✅ Manual navigation (arrows and pagination dots)
- ✅ Smooth fade transitions
- ✅ Semantic HTML
- ✅ Accessible components
- ✅ Optimized images with next/image

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main landing page
│   └── globals.css     # Global styles and Tailwind imports
├── components/
│   ├── Header.tsx      # Sticky navigation header
│   └── HeroSlider.tsx  # Reusable hero slider component
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.js
```

## Customization

### Changing Slider Images

Edit the `slides` array in `app/page.tsx` to customize the hero slider images, headlines, subtitles, and CTA text.

### Modifying Colors

Update the Tailwind classes in the components or extend the theme in `tailwind.config.js`.

### Adjusting Auto-play Interval

Change the `autoPlayInterval` prop in the `HeroSlider` component (default: 5000ms).

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 14+
- React 18
- TypeScript
- Tailwind CSS
- Next.js Image Optimization
