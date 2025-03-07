# Eventos - Event Management Platform

![Django](https://img.shields.io/badge/Django-5.1-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.2-blue.svg)
![React](https://img.shields.io/badge/React-19.0-blue.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38b2ac.svg)

A modern, full-stack event management platform built with Django REST Framework and Next.js. This application allows users to discover, create, and manage events, with features for both event organizers and attendees.

## 🌟 Features

### For Attendees
- Browse and search for events by category, location, and date
- View detailed event information
- Register for events
- Manage event registrations

### For Organizers
- Create and manage events
- Track attendee registrations
- Manage event details and updates
- Analytics for event performance

## 🛠️ Tech Stack

### Backend
- **Django 5.1**: Python web framework
- **Django REST Framework**: For building the API
- **SQLite** (Development) / **PostgreSQL** (Production): Database
- **CORS Headers**: For handling Cross-Origin Resource Sharing

### Frontend
- **Next.js 15.2**: React framework with server-side rendering
- **React 19.0**: JavaScript library for building user interfaces
- **TailwindCSS**: Utility-first CSS framework
- **Headless UI**: Unstyled, accessible UI components
- **Heroicons**: Beautiful hand-crafted SVG icons
- **React Hook Form**: For form handling
- **Axios**: For API requests

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Python 3.10 or higher
- pip

## 🚀 Installation

### Clone the repository

```bash
git clone https://github.com/yourusername/eventos.git
cd eventos
```

### Backend Setup

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run migrations:

```bash
python manage.py migrate
```

4. Create a superuser (admin):

```bash
python manage.py createsuperuser
```

5. Start the development server:

```bash
python manage.py runserver
```

The backend will be available at http://localhost:8000/

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
```

The frontend will be available at http://localhost:3000/

## 🔧 Configuration

### Environment Variables

Create a `.env` file in both the backend and frontend directories with the following variables:

#### Backend (.env)

```
DEBUG=True
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url (for production)
```

#### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📱 Usage

### Admin Panel

Access the Django admin panel at http://localhost:8000/admin/ using the superuser credentials created during setup.

### API Endpoints

- **Events**: `/api/events/`
- **Categories**: `/api/categories/`

## 🧪 Testing

### Backend Tests

```bash
cd backend
python manage.py test
```

### Frontend Tests

```bash
cd frontend
npm run test
# or
yarn test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Hat tip to anyone whose code was used
- Inspiration
- etc.