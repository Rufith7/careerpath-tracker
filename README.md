<img width="1440" height="900" alt="Screenshot 2026-04-02 at 3 58 50 PM" src="https://github.com/user-attachments/assets/413605d3-7fd3-407c-80cf-9cb4426a7eb3" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 3 59 27 PM" src="https://github.com/user-attachments/assets/1cdda559-1ebb-452f-9de1-8de9e58fe0c6" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 00 13 PM" src="https://github.com/user-attachments/assets/989f6cda-eb23-471f-b23e-772fbcb023ab" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 00 25 PM" src="https://github.com/user-attachments/assets/406756fa-ed2f-4ae5-a5be-113344e91a7b" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 01 05 PM" src="https://github.com/user-attachments/assets/3a0b41fc-2f80-46c2-8ec4-3686853fcf3c" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 01 23 PM" src="https://github.com/user-attachments/assets/a4ea2370-f535-4422-bd33-9c5ef1eda016" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 01 37 PM" src="https://github.com/user-attachments/assets/46fbac1f-a20d-48b1-9d7a-4ec8a5f0589c" />
<img width="1440" height="900" alt="Screenshot 2026-04-02 at 4 02 36 PM" src="https://github.com/user-attachments/assets/249170d1-109e-4811-8e3d-d06274cd4996" />
#  CareerPath Tracker

A full-stack career guidance platform that helps users track progress, prepare for interviews, build resumes, and get personalized career recommendations.

##  Features

*  **Authentication**

  * Secure login & registration (JWT-based)
  * Persistent user sessions

*  **Dashboard**

  * Multiple career domains (IT, Data Science, Healthcare, Finance, etc.)
  * Progress tracking and insights

*  **Quiz System**

  * Real-world technical questions
  * Score-based progression
  * Domain-wise tracking

*  **Resume Builder**

  * Predefined templates
  * Editable content
  * ATS-friendly structure

*  **Career Recommendation**

  * Questionnaire-based analysis
  * AI-driven suggestions
  * Career roadmaps

*  **Learning Resources**

  * Interview preparation
  * Aptitude resources
  * Domain-specific materials

##  Tech Stack

**Frontend**

* React
* React Router
* Axios
* Framer Motion

**Backend**

* Node.js
* Express.js
* JWT Authentication
* bcrypt

## Project Structure

```
CareerPath2/
├── client/              # Frontend (React)
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
├── server.js            # Main backend server
├── stable-server.js     # Stable backend version
└── README.md
```

## 🛠️ Run Locally

###  Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/careerpath-tracker.git
cd careerpath-tracker
```

###  Start Backend

```bash
npm install
node stable-server.js
```

 Backend runs on: `http://localhost:5001`

### Start Frontend

```bash
cd client
npm install
npm start
```

 Frontend runs on: `http://localhost:3000`

##  Demo Login

```
Email:    demo@careerpath.com
Password: demo123
```

##  Important Notes

* This project currently runs **locally (frontend + backend)**
* Backend must be running for data features
* No cloud deployment configured yet

##  Testing

* Login / Register functionality
* Quiz system with scoring
* Resume builder preview
* Career recommendation flow

##  Future Improvements

* Edit/Delete functionality
* Advanced filters & search
* Improved UI/UX
* Deployment (Vercel + backend hosting)
* Database integration (MongoDB)

##  Author

**Rufith Shaik**

##  If you like this project

Give it a star on GitHub — it helps visibility!
