# <p align="center">Cedar Groves Golf</p>
<p align="center"><img alt="image" src="https://github.com/user-attachments/assets/c9ff0743-8e83-4d40-8e1e-8bc6bc73d760" /></p>
<p align="center">Website for <a href="https://cedargrovesgolf.ca">Cedar Groves Executive Par 3 &amp; Driving Range</a>, built with Express, EJS, and Bootstrap, with a small admin CMS backed by DynamoDB. Runs on AWS Lambda behind CloudFront, defined with AWS SAM and deployed from GitHub Actions.</p>

## Directory Structure

```bash
.
├── .github/          # CI/CD
├── infra/            # AWS infrastructure
├── scripts/          # Lambda startup
├── test/             # Tests
└── app/
    ├── lib/          # AWS and auth
    ├── middleware/   # Middleware
    ├── public/       # Static files
    ├── routes/       # Routes
    ├── views/        # Templates
    ├── app.js        # Express app
    ├── config.js     # Config
    └── server.js     # Entry point
```

## Development

```bash
nvm use
npm ci
npm run dev    # reads app/.env if present
npm run lint
npm test
```

Media is served from `/assets/`. For local development, copy the assets into `app/public/assets/`.
