# Social-Sphere

Social-Sphere is a web application that allows users to manage multiple social media accounts from a single platform. Users can post content across different platforms, track analytics, and streamline their social media management efficiently.

## Features

- **Multi-Platform Posting**: Post to multiple social media platforms from one place.
- **Account Management**: Connect and manage accounts for TikTok, YouTube, Instagram, X (Twitter), and more.
- **Analytics Dashboard**: View engagement metrics and performance insights for posts.
- **AI-Powered Content Optimization**: Generate platform-specific posts from a single draft.
- **Scheduled Posting**: Plan and schedule posts in advance.
- **OAuth 2.0 Authentication**: Secure login and authorization for user accounts.

## Tech Stack

- **Frontend**: Vite, React.js, TypeScript, Tailwind CSS
- **Backend**: Flask
- **Authentication**: Flask, OAuth 2.0
- **APIs**: TikTok API, YouTube API, Instagram API, Twitter API
- **Deployment**: Docker, AWS/GCP (Optional)

## Installation & Setup

### Prerequisites

Ensure you have the following installed:
- Python & pip
- Node.js & npm
- MongoDB
- Git

### Clone the Repository
```bash
 git clone https://github.com/waltertaya/social-sphere.git
 cd social-sphere
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python3 app.py
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Authentication Setup
```bash
cd Authentication
pip install -r requirements.txt
make run
```

## Environment Variables

Create a `.env` file in the backend directory and add:
```
PORT=8080
HOST='0.0.0.0'
DEBUG=True
SECRET_KEY
CACHE_HOST
CACHE_PORT=13549
CACHE_DECODE_RESPONSES=True
CACHE_USERNAME
CACHE_PASSWORD
JWT_SECRET_KEY
JWT_TOKEN_LOCATION
```

Create a `client-secret.json (for youtube)` file in the backend directory and add

## API Documentation

API routes and endpoints will be documented using Postman or Swagger soon.

## Contribution

Feel free to fork this repository, open issues, and submit pull requests.

## License

This project is licensed under the MIT License.

---

**Stay connected:**
- (Website)[Coming Soon]
- [Twitter](https://x.com/Walter5mitty)
- [LinkedIn](https://linkedin.com/in/walter-onyango)

## Author

- [waltertaya](#)
