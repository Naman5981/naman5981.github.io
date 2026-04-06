# Naman Sanadhya Portfolio

This repository contains the source code for Naman Sanadhya's personal portfolio website. It is a React-based single-page site used to present professional experience, technical skills, education, selected projects, and a downloadable resume.

## Live Site

- Portfolio: [https://namansanadhya.vercel.app](https://namansanadhya.vercel.app)
- LinkedIn: [https://www.linkedin.com/in/namansanadhya/](https://www.linkedin.com/in/namansanadhya/)
- GitHub: [https://github.com/naman5981](https://github.com/naman5981)

## Overview

The site is designed as a compact portfolio layout with separate sections for:

- About and contact information
- Work experience
- Education
- Skills
- Projects
- Resume download

The content is currently managed directly in React components, which makes the project easy to update for quick portfolio revisions.

## Tech Stack

- React 18
- Create React App
- Plain CSS
- Bootstrap and React Bootstrap
- Font Awesome
- Vercel for deployment

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |-- styles/
|   |-- App.js
|   `-- index.js
|-- package.json
`-- README.md
```

Key folders:

- `src/components`: Portfolio sections such as About, Experience, Education, Skills, and Projects
- `src/styles`: Section-specific CSS files and shared color tokens
- `src/assets`: Reserved for app-bundled assets if needed in future
- `public`: Static files used by the app shell, favicon, and manifest

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

The app will usually be available at [http://localhost:3000](http://localhost:3000).

### Create a production build

```bash
npm run build
```

## Deployment

This project is deployed on Vercel.

Typical deployment flow:

1. Push changes to GitHub.
2. Let Vercel build and deploy from the connected branch.
3. Use `main` for production and feature branches for preview deployments.

## Customization Guide

If you want to reuse or update this portfolio, these are the main places to edit:

- Personal summary and contact details: `src/components/About.js`
- Work history: `src/components/Experience.js`
- Education: `src/components/Education.js`
- Skills: `src/components/Skills.js`
- Projects: `src/components/Projects.js`
- Resume file: `public/Naman_Sanadhya_Resume.pdf` or the Supabase-hosted path returned by the profile record
- Theme colors: `src/styles/colors.css`
- Overall layout: `src/styles/App.css`

## Current Notes

- The app uses hardcoded content rather than a CMS or JSON data source.
- A few dependencies are installed that are not central to the current UI.
- The default Create React App test setup may need cleanup if test coverage is expanded.

## Future Improvements

- Improve mobile responsiveness
- Add richer project cards with links and screenshots
- Add SEO metadata and social sharing tags
- Replace hardcoded content with structured data
- Add animations and polish to section transitions
- Refresh the README with screenshots of the live site

## License

This project is personal portfolio code. Reuse is possible, but update the personal content, branding, and links before publishing your own version.
