# DevConnect - Intelligent Freelancer-Company Matching Platform

## Problem Statement

Companies struggle to find the right freelancers for their projects, and freelancers struggle to find projects that match their skills and experience. The traditional hiring process is time-consuming, inefficient, and often results in poor matches. Key challenges include:

- **Skill Mismatch**: Companies post projects without clear skill requirements, leading to applications from unqualified developers
- **Manual Screening**: Companies manually review hundreds of applications, wasting time on unsuitable candidates
- **Poor Visibility**: Developers don't know which projects are best suited for their skills and experience
- **Lack of Communication**: No structured way for companies and developers to communicate during project execution
- **No Project Tracking**: Difficulty tracking project progress, submissions, and deliverables

## Solution

DevConnect is an intelligent platform that:

1. **AI-Powered Matching**: Uses machine learning to match developers with projects based on skills, experience, portfolio quality, and proposed rates
2. **Smart Ranking**: Ranks applications using a weighted ensemble model (Gradient Boosting + Random Forest) with component scoring
3. **Project Assignment Workflow**: Streamlined process for assigning projects with automated notifications
4. **Real-Time Chat**: Communication interface between companies and developers for project discussion
5. **Submission Management**: Structured submission process with Figma design deadlines (1 week) and project submission deadlines (30 days)
6. **Review System**: Company review panel for approving or requesting revisions on submissions
7. **Portfolio System**: Developers can showcase their work with ratings and project history

## Key Features

### For Developers
- Browse and apply to projects
- View personalized project recommendations
- Manage portfolio with project showcases
- Track assigned projects with deadline countdowns
- Submit Figma designs and final projects
- Real-time chat with companies
- View earnings and project history

### For Companies
- Post projects with detailed requirements
- View ranked applications with AI match scores
- Assign projects to selected developers
- Real-time communication with assigned developers
- Review and approve/reject submissions
- Track all assigned projects

### AI/ML Features
- **Skill Matching**: Compares required skills with developer skills (35% weight)
- **Experience Fit**: Evaluates years of experience (25% weight)
- **Portfolio Quality**: Considers developer ratings (20% weight)
- **Proposal Quality**: Analyzes cover letter depth (15% weight)
- **Rate Fit**: Matches proposed rate with budget (5% weight)

## Tech Stack

### Backend
- **Framework**: Django + Django REST Framework
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth (JWT-based)
- **ML Models**: Scikit-learn (Gradient Boosting, Random Forest)
- **API**: RESTful API with custom actions

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: CSS with modern glassmorphism design
- **State Management**: React Hooks (useState, useEffect)
- **HTTP Client**: Fetch API

### Infrastructure
- **Backend Server**: Django development server (localhost:8000)
- **Frontend Server**: Vite dev server (localhost:5173)
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth

## Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 16+
- PostgreSQL (via Supabase)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**
Create `.env` file in backend directory:
```
DEBUG=True
SECRET_KEY=your_secret_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_DB_PASSWORD=your_db_password
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Start backend server**
```bash
python manage.py runserver
```
Backend will be available at `http://127.0.0.1:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```
Frontend will be available at `http://localhost:5173`

4. **Build for production**
```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register/developer/` - Register as developer
- `POST /api/auth/register/company/` - Register as company
- `POST /api/auth/login/` - Login
- `GET /api/auth/profile/` - Get user profile

### Projects
- `GET /api/projects/` - List all projects
- `POST /api/projects/` - Create project (company only)
- `GET /api/projects/{id}/` - Get project details
- `POST /api/projects/{id}/apply/` - Apply to project

### Applications
- `GET /api/projects/applications/` - List applications
- `GET /api/projects/{projectId}/applications/` - Get project applications

### Assignments
- `POST /api/projects/assignments/assign_project/` - Assign project to developer
- `GET /api/projects/assignments/developer_assignments/` - Get developer's assignments
- `GET /api/projects/assignments/company_assignments/` - Get company's assignments
- `GET /api/projects/assignments/{id}/chat/` - Get chat messages
- `POST /api/projects/assignments/{id}/send_message/` - Send chat message
- `POST /api/projects/assignments/{id}/submit_figma/` - Submit Figma designs
- `POST /api/projects/assignments/{id}/submit_project/` - Submit final project
- `POST /api/projects/assignments/{id}/review_submission/` - Review submission

## ML Model Details

### Matching Algorithm

The platform uses an ensemble approach combining two models:

1. **Gradient Boosting Classifier**
   - Captures non-linear relationships between features
   - Better for complex patterns in developer-project matching

2. **Random Forest Classifier**
   - Robust to outliers and feature scaling
   - Provides feature importance insights

### Feature Engineering

Features extracted for each application:
- Skill overlap ratio
- Experience level normalized
- Portfolio rating
- Proposal quality score
- Rate fit score
- Project complexity alignment
- Developer success rate
- Text embeddings (project description & developer profile)

### Scoring Components

Each application receives scores in 5 categories:

| Component | Weight | Description |
|-----------|--------|-------------|
| Skill Match | 35% | Percentage of required skills developer has |
| Experience Fit | 25% | Years of experience vs project requirements |
| Portfolio Quality | 20% | Developer's average rating (0-5 stars) |
| Proposal Quality | 15% | Quality and depth of cover letter |
| Rate Fit | 5% | How well proposed rate matches budget |

**Final Score** = Weighted average of all components (0-100)

### Model Training

Models are trained on historical application data with labels indicating successful matches. The training pipeline:

1. Feature extraction from applications
2. Feature scaling using StandardScaler
3. Binning scores into 4 categories (0-25, 25-50, 50-75, 75-100)
4. Training both classifiers
5. Ensemble prediction with weighted averaging

## Project Workflow

### 1. Project Creation
- Company posts project with title, description, tech stack, budget, timeline
- Project status: "Open for Applications"

### 2. Developer Application
- Developer browses projects and applies
- Submits cover letter and proposed rate
- ML model scores the application

### 3. Application Review
- Company views ranked applications with AI scores
- Can see skill match, experience fit, portfolio quality breakdown
- Selects best candidate and assigns project

### 4. Project Assignment
- Automated congratulations message sent to developer
- Chat interface created for communication
- Figma design deadline set (7 days from assignment)
- Project submission deadline set (30 days from assignment)

### 5. Figma Submission
- Developer submits Figma design URL with description
- Company can view and discuss in chat
- Countdown timer shows remaining time

### 6. Project Submission
- Developer submits final project with:
  - Rich text description
  - Documentation links (PDFs)
  - GitHub repository links
  - Live project links
  - Additional links
- Company receives notification

### 7. Review & Approval
- Company reviews submission
- Can approve project or request revisions
- Feedback sent to developer via chat
- Developer can resubmit if revisions requested

## Database Schema

### Key Models

**User** (Django Auth)
- id, email, password, first_name, last_name

**DeveloperProfile**
- user (FK), title, bio, skills, years_experience, rating, hourly_rate

**CompanyProfile**
- user (FK), company_name, company_size, industry, description

**Project**
- company (FK), title, description, tech_stack, budget_min, budget_max, status, created_at

**ProjectApplication**
- project (FK), developer (FK), cover_letter, proposed_rate, match_score, skill_match_score, experience_fit_score, portfolio_quality_score, status, applied_at

**ProjectAssignment**
- project (OneToOne), developer (FK), application (FK), assigned_at, figma_deadline, submission_deadline, figma_submitted, project_submitted

**ProjectChat**
- assignment (OneToOne), created_at

**ChatMessage**
- chat (FK), sender (FK), message, message_type, created_at

**FigmaDesignSubmission**
- assignment (OneToOne), figma_url, description, submitted_at

**ProjectSubmission**
- assignment (OneToOne), description, documentation_links, github_links, project_links, additional_links, approved, company_feedback, submitted_at

## File Structure

```
HM065_Lazarus/
├── backend/
│   ├── devconnect/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── accounts/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── projects/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── api_views.py
│   │   ├── assignment_views.py
│   │   ├── matcher.py
│   │   ├── urls.py
│   │   └── serializers.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── DeveloperRegister.jsx
│   │   │   ├── CompanyRegister.jsx
│   │   │   ├── ProjectBrowser.jsx
│   │   │   ├── ApplicationsView.jsx
│   │   │   ├── AssignedProjects.jsx
│   │   │   ├── ProjectChatInterface.jsx
│   │   │   ├── FigmaSubmissionForm.jsx
│   │   │   ├── ProjectSubmissionForm.jsx
│   │   │   ├── SubmissionReviewPanel.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Usage Examples

### Register as Developer
1. Go to `http://localhost:5173`
2. Click "Register as Developer"
3. Fill in email, password, name, skills, experience
4. Submit

### Register as Company
1. Go to `http://localhost:5173`
2. Click "Register as Company"
3. Fill in email, password, company name, industry
4. Submit

### Post a Project (Company)
1. Login as company
2. Go to Dashboard → Post Project
3. Fill in project details, tech stack, budget, timeline
4. Submit

### Apply to Project (Developer)
1. Login as developer
2. Browse Projects
3. Click on project and fill application form
4. Submit

### Assign Project (Company)
1. Go to My Projects → View Applications
2. See ranked applications with AI scores
3. Click "Assign Project" on best candidate
4. Developer receives notification

### Submit Figma Designs (Developer)
1. Go to Assigned Projects
2. Click on project
3. Click "Submit Figma Designs"
4. Enter Figma URL and description
5. Submit

### Submit Final Project (Developer)
1. After Figma submission, click "Submit Final Project"
2. Fill in description and add links
3. Submit

### Review Submission (Company)
1. Go to Assigned Projects
2. Click "Review Submission"
3. View submission details
4. Approve or request revisions

## Performance Considerations

- **ML Scoring**: Runs asynchronously when application is created
- **Chat Polling**: Frontend polls every 3 seconds for new messages
- **Database Indexing**: Indexes on frequently queried fields (user_id, project_id, status)
- **Caching**: Session tokens cached in localStorage

## Security Features

- JWT-based authentication via Supabase
- CSRF protection on all POST requests
- SQL injection prevention via ORM
- XSS protection via React's built-in escaping
- CORS configured for allowed origins only
- Password hashing via Supabase

## Future Enhancements

- WebSocket integration for real-time chat
- Video call integration for interviews
- Payment processing integration
- Advanced analytics dashboard
- Reputation system with reviews
- Automated project matching recommendations
- Mobile app (React Native)
- Email notifications
- Project templates

## Troubleshooting

### Backend won't start
- Check if port 8000 is available
- Verify Supabase credentials in .env
- Run migrations: `python manage.py migrate`

### Frontend won't start
- Check if port 5173 is available
- Clear node_modules: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version`

### ML scoring not working
- Check if matcher.py is in projects directory
- Verify scikit-learn is installed: `pip install scikit-learn`
- Check console for error messages

### Authentication issues
- Verify Supabase URL and keys in .env
- Check if user exists in Supabase
- Clear localStorage and try again

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit pull request

## License

MIT License - See LICENSE file for details

## Contact

For questions or support, contact the development team.

---

**Last Updated**: January 18, 2026
**Version**: 1.0.0
