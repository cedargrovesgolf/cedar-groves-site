# <p align="center">Cedar Groves Golf</p>

<p align="center"><img width="400" alt="Cedar Groves" src="https://user-images.githubusercontent.com/97645707/234732632-04ff9f57-acc4-4577-bf5b-5c2687cb332c.png" /></p>
<p align="center">Website for <a href="https://cedargrovesgolf.ca">Cedar Groves Executive Par 3 &amp; Driving Range</a>, built with Express, EJS, and Bootstrap, with a small admin CMS backed by DynamoDB. Containerized with Docker and deployed to AWS EC2 through CircleCI.</p>

## Directory Structure

```bash
.
├── .circleci/        # CircleCI build and deploy pipeline
├── scripts/          # Docker build and EC2 deploy scripts
└── app/
    ├── helper/       # DynamoDB, mail, hashing, and cache helpers
    ├── public/       # Static assets
    ├── routes/       # Page routes
    │   └── cms/      # Admin CMS routes
    ├── views/        # EJS templates
    └── server.js     # Express entry point
```
