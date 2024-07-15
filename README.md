# Astro Starter Kit

This project is my default starting point for Astro projects. It comes with:

- [Bun](https://bun.sh/)
- [Astro](https://astro.build/)
- [Typescript](https://www.typescriptlang.org/)
- [A fleshed-out prettier config](https://prettier.io/)
- [Open-Props](https://open-props.style/#typography)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── layouts/
│   └── Layout.astro
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

Any static assets, like images, can be placed in the `public/` directory.

## Using This Template

1. Create a new repository on GitHub
2. Set the origin: `git remote set-url <new repo url>`
3. Set the upstream: `git remote add upstream git@github.com:joshatbond/astro-template.git`
4. Push to the new repo: `git push -u origin main`

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |
