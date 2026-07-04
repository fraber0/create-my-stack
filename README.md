# create-my-stack

A CLI scaffolding tool to quickly generate Vite + React + Tailwind CSS v4 projects, with optional support for Supabase, Docker, and automatic deployment via GitHub Actions.

## Usage

```bash
npx @fraber0/create-my-stack my-project
```

The interactive wizard will ask whether you want to include:
- **Supabase** — a configured client for auth/database, with ready-to-use environment variables
- **Docker** — a production-ready multi-stage build (Node + nginx)
- **GitHub Actions** — an automatic deploy workflow to GitHub Pages

## Generated stack

- [Vite](https://vite.dev) — build tool and dev server
- [React](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) *(optional)*
- Multi-stage Docker build *(optional)*
- GitHub Actions deploy to GitHub Pages *(optional)*

## After generation

```bash
cd my-project
npm install
npm run dev
```

If you included Supabase, rename `.env.example` to `.env` and add your credentials from the [Supabase dashboard](https://supabase.com/dashboard):
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

If you included Docker:

```bash
docker build -t my-project .
docker run -p 8080:80 my-project
```

If you included GitHub Actions, push to `main` and GitHub will automatically build and deploy your project to GitHub Pages (make sure Pages is enabled in your repo settings, under "GitHub Actions" as the source).

## Requirements

- Node.js >= 18

## License

MIT © fraber0
