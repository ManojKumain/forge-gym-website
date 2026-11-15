# FORGE - Premium Gym Website

A responsive, conversion-focused website concept for a premium, beginner-friendly neighbourhood fitness studio.

## Project Goal

Generate qualified enquiries by helping prospective gym members understand the studio, explore its offerings, build trust, and take the next step.

## Repository Structure

- frontend/ - React, TypeScript and Vite application
- backend/ - Node.js, Express and TypeScript API
- docs/ - Technical documentation

## Technology Stack

### Frontend
- React 19
- TypeScript
- Vite
- Oxlint

### Backend
- Node.js
- Express 5
- TypeScript
- Zod
- CORS
- dotenv

## Local Development

### Frontend

Run from the repository root:

    cd frontend
    npm install
    npm run dev

### Backend

Run from the repository root:

    cd backend
    npm install
    npm run dev

Backend health endpoint: http://localhost:3000/api/health

## Production Builds

Frontend:

    cd frontend
    npm run build

Backend:

    cd backend
    npm run build
    npm start

## Deployment Plan

- Frontend: Vercel
- Backend: Render

Both applications will be deployed independently.
