# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GreenSun is a photovoltaic construction company website featuring a modern, responsive design with both frontend and backend components. The project includes:

- **Frontend**: Single-page HTML website (`index.html`) with vanilla JavaScript and CSS
- **Backend**: Contact form handling with dual implementation (Node.js Express + PHP fallback)  
- **DRAFT**: Reusable navbar component with i18n and theme switching

## Architecture

### Frontend Structure
- `index.html` - Main website file with all sections (hero, about, services, gallery, contact)
- Embedded CSS and JavaScript (no external dependencies)
- SVG icons in `/media/icons/` loaded dynamically
- Video background in hero section (`/media/GreenSun.webm`)

### Backend Structure
- **Node.js** (recommended): Express server with nodemailer, rate limiting, CORS
- **PHP** (fallback): Simple contact form handler
- Both backends provide identical API endpoints for contact form submission

### DRAFT Components
- `navbar.js` - Multilingual navbar with theme switching (PL/EN/FR)
- `navbar-styles.css` - Complete CSS variables system
- `navbar.html` - HTML structure with accessibility features

## Development Commands

### Backend (Node.js)
```bash
cd backend
npm install          # Install dependencies
npm run dev          # Development with nodemon
npm start            # Production server
npm test             # Run Jest tests
npm run lint         # ESLint code checking
```

### No Build Process
This is a static website with no build pipeline. Changes to HTML/CSS/JS are immediately reflected.

## Key Configuration

### Email Setup (Backend)
In `backend/server.js`, configure SMTP settings:
```javascript
const emailConfig = {
  host: 'smtp.gmail.com',
  auth: {
    user: 'your-email@gmail.com',     // Update this
    pass: 'your-app-password'         // Update this
  }
};
```

### Analytics Integration
Replace placeholder IDs in `index.html`:
- Google Analytics: `GA_MEASUREMENT_ID`
- Meta Pixel: `YOUR_PIXEL_ID`

## Technology Stack

- **Frontend**: Vanilla HTML5/CSS3/JavaScript (no frameworks)
- **Backend**: Node.js + Express OR PHP
- **Dependencies**: nodemailer, cors, express-rate-limit, helmet, validator
- **Styling**: CSS Grid/Flexbox with CSS custom properties
- **Icons**: SVG files dynamically loaded

## Security Features

- Rate limiting (5 messages/hour per IP)
- Input validation and sanitization
- CORS headers configuration
- Security headers via Helmet
- No external CDN dependencies

## Responsive Design

- Mobile-first approach
- Breakpoints: Mobile (<599px), Tablet (600-991px), Desktop (>992px)
- CSS Grid for gallery, Flexbox for navigation
- Touch-friendly mobile interactions

## Deployment Notes

- Static hosting for frontend (any web server)
- Backend can run on Node.js hosting or shared PHP hosting
- No database required - form submissions via email
- SSL certificate recommended for production