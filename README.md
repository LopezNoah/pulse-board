# Pulse Board
This project is inspired by a post I saw on X (Twitter). It looked clean enough that I wanted to re-create it with some additional CRUD features.

**My implementation**<br>
![Screenshot 2025-02-19 at 8 10 49 PM](https://github.com/user-attachments/assets/74cd1891-d09c-4665-bfb1-b51f800e3210)

**Original**<br>
![Screenshot 2025-02-19 at 8 09 58 PM](https://github.com/user-attachments/assets/bd334166-acfa-490a-9ec4-ea99d2556662)

## Getting Started

## Deployment

Deployment is done using the Wrangler CLI.

First, you need to create a d1 database in Cloudflare.

```sh
npx wrangler d1 create <name-of-your-database>
```

Be sure to update the `wrangler.toml` file with the correct database name and id.

You will also need to [update the `drizzle.config.ts` file](https://orm.drizzle.team/docs/guides/d1-http-with-drizzle-kit), and then run the production migration:

```sh
npm run db:migrate-production
```

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

---

Built with ❤️ using React Router.
