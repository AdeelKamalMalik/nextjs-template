
# Blog Site Frontend (Next.js)

This project is the frontend UI for a blog site, built with Next.js. It utilizes server-side rendering (SSR) and static site generation (SSG) for performance and SEO optimization. The UI integrates with a backend API to fetch and display dynamic blog content.

## Prerequisites

- Node.js (v14+)
- npm or yarn

## Setup

1. Clone the repository:

   ```bash
   git clone git@github.com:AdeelKamalMalik/nextjs-template.git
   cd nextjs-template
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

   or if you use yarn:

   ```bash
   yarn install
   ```

3. Set up environment variables:

   Create a `.env.local` file to store API-related environment variables:

   ```env
   NEXT_PUBLIC_API_URL=<your_backend_api_url>
   ```

## Running the Project

To start the development server:

```bash
npm run dev
```

or with yarn:

```bash
yarn dev
```

## Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

or with yarn:

```bash
yarn start
```

## License

This project is licensed under the MIT License.