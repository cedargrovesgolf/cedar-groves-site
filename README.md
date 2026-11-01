# <p align="center">Cedar Groves Golf</p>
<p align="center"><img alt="image" src="https://github.com/user-attachments/assets/c9ff0743-8e83-4d40-8e1e-8bc6bc73d760" /></p>
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
