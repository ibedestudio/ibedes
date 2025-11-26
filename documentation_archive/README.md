# Ibedes - Personal Website & Blog

> A modern, retro-inspired personal website featuring a blog, portfolio, affiliate system, and full-featured admin dashboard.

![Ibedes Website](https://ibedes.xyz/og-image.png)

## 🎯 Introduction

**Ibedes** is a personal website and blog platform built with modern web technologies while embracing a retro gaming aesthetic. The site combines the performance and developer experience of Astro with a unique design system inspired by classic 8-bit and 16-bit era interfaces.

This project serves as:
- **Personal Blog** - Share articles, tutorials, and thoughts
- **Portfolio** - Showcase projects and services
- **Affiliate Platform** - Manage and display affiliate products
- **Content Management** - Full admin dashboard for content creation

## ✨ Key Features

### 🎨 Design System
- **Retro-Inspired Aesthetic** - Pixel-perfect design with gaming influences
- **Dark & Light Mode** - Seamless theme switching with system preference detection
- **Custom Typography** - Press Start 2P, IBM Plex Mono, and Literata fonts
- **Responsive Design** - Mobile-first approach with fluid layouts
- **Accessible** - WCAG compliant components and semantic HTML

### 🚀 Performance
- **100/100 Lighthouse Score** - Optimized for speed and accessibility
- **Static Site Generation** - Fast page loads with Astro
- **Optimized Images** - Automatic image optimization
- **Minimal JavaScript** - Only load what's needed

### 📝 Content Management
- **Admin Dashboard** - Full-featured CMS accessible at `/admin`
- **Markdown Editor** - Write articles with live preview
- **Product Management** - Add and manage affiliate products
- **Metadata Control** - SEO optimization tools
- **Image Upload** - Built-in asset management

### 🎯 Blog Features
- **Table of Contents** - Auto-generated navigation for long articles
- **Reading Progress** - Visual indicator of reading position
- **Code Highlighting** - Syntax highlighting with copy button
- **Image Lightbox** - Click to zoom images
- **Related Articles** - Automatic content recommendations
- **Share Actions** - Social media sharing integration
- **Text Selection Sharing** - Share selected text snippets
- **Floating Reactions** - Interactive emoji reactions
- **Comments System** - Supabase-powered discussions

### 💼 Affiliate System
- **Product Showcase** - Display affiliate products beautifully
- **Link Management** - Track and manage affiliate links
- **Product Integration** - Link products to relevant articles
- **Category Organization** - Organize products by category

### 🔒 Security
- **Admin Authentication** - Secure login system
- **Session Management** - Cookie-based authentication
- **Protected Routes** - Middleware-based route protection

## 🛠️ Tech Stack

### Core Technologies
- **[Astro](https://astro.build)** v5.16 - Static site generator
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** v4 - Utility-first styling
- **[React](https://react.dev/)** v19 - Interactive components

### Additional Libraries
- **[@astrojs/netlify](https://docs.astro.build/en/guides/deploy/netlify/)** - Netlify adapter
- **[gray-matter](https://github.com/jonschlinkert/gray-matter)** - Frontmatter parsing
- **[fuse.js](https://fusejs.io/)** - Fuzzy search
- **[GSAP](https://greensock.com/gsap/)** - Animations
- **[Satori](https://github.com/vercel/satori)** - OG image generation
- **[Supabase](https://supabase.com/)** - Backend services

### Deployment
- **[Netlify](https://netlify.com)** - Hosting and deployment
- **GitHub** - Version control and CMS integration

## 🎨 Design Philosophy

### Visual Language
The design system draws inspiration from retro gaming interfaces while maintaining modern usability:

- **Pixel-Perfect Borders** - Bold 2-3px borders for clear visual hierarchy
- **Monospace Typography** - IBM Plex Mono for technical content
- **Display Font** - Press Start 2P for headings and branding
- **Serif Content** - Literata for comfortable reading
- **Color System** - High contrast with emerald accent colors
- **Retro Marquee** - Animated top banner inspired by arcade games

### Component Design
- **Card-Based Layouts** - Contained, bordered sections
- **Tactile Interactions** - Button press effects and hover states
- **Glassmorphism** - Subtle backdrop blur effects
- **Smooth Transitions** - 150-300ms easing for interactions

### Layout Principles
- **Grid-Based** - Structured layouts with clear alignment
- **Whitespace** - Generous spacing for readability
- **Responsive Breakpoints** - Mobile, tablet, desktop optimized
- **Compact Mobile** - Efficient use of screen space

## 📦 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ibedestudio/ibedes.git
cd ibedes

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun run dev
```

The site will be available at `http://localhost:4321`

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (for comments)
PUBLIC_SUPABASE_URL=your_supabase_url
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub CMS (optional)
GITHUB_TOKEN=your_github_token
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_repo_name
GITHUB_BRANCH=main

# Admin Authentication
ADMIN_USER=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## 📝 Content Management

### Admin Panel

Access the admin panel at `/admin` with your credentials:

**Features:**
- 📊 **Overview** - Dashboard with statistics
- 📰 **Articles** - Manage blog posts
- 🏷️ **Products** - Manage affiliate products
- 📈 **Analytics** - Content performance metrics
- ⚙️ **Settings** - Site configuration

### Writing Articles

Articles are stored in `src/pages/blog/` as Markdown files:

```markdown
---
title: "Your Article Title"
description: "Brief description for SEO"
pubDate: 2025-01-26
tags: ["web-dev", "tutorial"]
categories: ["Programming"]
affiliateProducts: ["product-id-1", "product-id-2"]
featuredImage: "/images/article-cover.jpg"
---

Your content here with full Markdown support...
```

### Managing Products

Add affiliate products through the admin panel or directly in `src/data/affiliates.json`:

```json
{
  "id": "product-slug",
  "name": "Product Name",
  "price": "Rp 299.000",
  "discount": "20%",
  "image": "https://example.com/image.jpg",
  "link": "https://affiliate-link.com",
  "category": "Electronics",
  "description": "Product description"
}
```

## 🎨 Customization

### Site Configuration

Edit `src/lib/variables.ts`:

```typescript
export const GLOBAL = {
  username: "ibedes",
  rootUrl: "https://ibedes.xyz",
  shortDescription: "Retro-Inspired Theme & Built for Astro",
  
  // Navigation
  menu: {
    home: "/",
    blog: "/blog",
    swag: "/swag",
    services: "/services",
  },
  
  // Social Links
  githubProfile: "https://github.com/ibedestudio",
  threadsProfile: "https://www.threads.com/@bellamujiaa",
  contactEmail: "ibedestudio@gmail.com",
  
  // ... more options
};
```

### Styling

The design system is defined in `src/styles/global.css`:

```css
@theme {
  --color-zag-dark: var(--color-neutral-900);
  --color-zag-light: var(--color-neutral-100);
  --color-zag-accent-light: var(--color-emerald-400);
  --color-zag-accent-dark: var(--color-emerald-600);
}
```

### Components

Reusable components are in `src/components/`:
- `Footer.astro` - Site footer
- `Header.astro` - Navigation header
- `SEO.astro` - Meta tags and SEO
- `common/` - Shared UI components
- `home/` - Homepage sections

## 📂 Project Structure

```
/
├── public/              # Static assets
│   ├── images/         # Image files
│   └── fonts/          # Custom fonts
├── src/
│   ├── components/      # Reusable components
│   │   ├── common/     # Shared UI elements
│   │   ├── home/       # Homepage sections
│   │   └── effects/    # Interactive effects
│   ├── layouts/         # Page layouts
│   │   ├── Layout.astro
│   │   └── BlogLayout.astro
│   ├── lib/            # Utilities and helpers
│   │   ├── variables.ts
│   │   ├── affiliates.ts
│   │   └── utils.ts
│   ├── pages/          # Routes and pages
│   │   ├── admin/      # Admin panel
│   │   ├── api/        # API endpoints
│   │   ├── blog/       # Blog articles
│   │   └── index.astro # Homepage
│   ├── styles/         # Global styles
│   │   └── global.css
│   └── data/           # Data files
│       └── affiliates.json
├── astro.config.mjs    # Astro configuration
├── tailwind.config.js  # Tailwind configuration
└── package.json        # Dependencies
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Netlify

The site is configured for automatic deployment:

1. Push to `main` branch
2. Netlify automatically builds and deploys
3. Site is live at your configured domain

Configuration is in `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```

## 🎯 Roadmap

- [ ] Newsletter integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode customization
- [ ] Enhanced search functionality
- [ ] RSS feed generation
- [ ] Sitemap automation

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Inspired by retro gaming aesthetics
- Theme foundation from [Zaggonaut](https://zaggonaut.dev)
- Typography from [Google Fonts](https://fonts.google.com) and [Bunny Fonts](https://fonts.bunny.net)

## 📧 Contact

- **Website**: [ibedes.xyz](https://ibedes.xyz)
- **Email**: ibedestudio@gmail.com
- **GitHub**: [@ibedestudio](https://github.com/ibedestudio)
- **Threads**: [@bellamujiaa](https://www.threads.com/@bellamujiaa)

---

**Made with ❤️ and ☕ by [ibedes](https://ibedes.xyz)**

*Keep building, stay curious.* 🚀