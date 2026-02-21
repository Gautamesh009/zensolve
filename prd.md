**HACKGENX 2026**

alphaCode \| HGX-839551

**Municipal Grievance System**

**UNIFIED PRODUCT REQUIREMENTS**

**DOCUMENT**

Backend · Web Admin · Mobile App · Citizen Web Portal

  --------------------- -------------------------------------------------
  **Version**           1.0 --- Final Pre-Hackathon Document

  **Date**              February 2026

  **Team**              alphaCode --- HGX-839551

  **Backend**           Node.js + Express + Prisma 5 + Supabase +
                        Cloudinary + Gemini 1.5 Flash

  **Web Frontend**      Vite + React 18 + Tailwind CSS 3 + shadcn/ui
                        (Admin + Citizen Portal)

  **Mobile**            Expo SDK 51 + React Native + NativeWind v4.1.10 +
                        Expo Router v3

  **Deployment**        Render (Backend) + Vercel (Web) + Expo Go (Mobile
                        Demo)

  **Status**            Ready to Build
  --------------------- -------------------------------------------------

**1. Overview**

This document is the single source of truth for the entire Municipal
Grievance System (MGS) built for HackGenX 2026 by team alphaCode. It
covers the backend API server, the web application (which serves both
admin dashboard and citizen portal through role-based routing), and the
mobile citizen app. All three share a single backend.

A key architectural decision documented here is that citizens can access
the platform through BOTH the mobile app AND the web browser. After
login, the web app detects the user\'s role and routes them to the
correct experience --- admins see the dashboard, citizens see the
citizen portal. This eliminates the gap where web-only citizens had no
way to submit complaints.

**2. Compatibility Audit --- All Technologies**

Every package has been researched for known compatibility issues. Read
this section carefully before Day 1 setup to avoid wasting hours on
avoidable problems.

**2.1 Backend Compatibility**

  -------------------- ------------- -------------- ----------------------------
  **Package / Layer**  **Version**   **Status**     **Notes**

  Node.js v20 LTS      v20+          **✓            LTS version --- stable, well
                                     Compatible**   supported on Render

  Express.js           4.18.x        **✓            Fully stable, no known
                                     Compatible**   issues

  Prisma ORM           5.x           **✓            Official Supabase
                                     Compatible**   integration. Use session
                                                    pooler (port 5432) +
                                                    DIRECT_URL for migrations

  Supabase JS SDK      2.x           **✓            Works with Node.js backend
                                     Compatible**   and React frontend

  Cloudinary SDK       2.x           **✓            Node.js v18+ required ---
                                     Compatible**   satisfied by Node 20

  Socket.IO            4.x           **✓            socket.io-client v4 must
                                     Compatible**   match server v4 exactly

  node-cron            3.x           **✓            No known issues with Node 20
                                     Compatible**   

  Google Gemini SDK    latest        **✓            Free tier via
                                     Compatible**   \@google/generative-ai npm
                                                    package

  express-rate-limit   7.x           **✓            Fully stable with Express 4
                                     Compatible**   

  Zod                  3.x           **✓            No peer dependency conflicts
                                     Compatible**   

  Multer               1.x           **✓            Standard multipart handler,
                                     Compatible**   no issues
  -------------------- ------------- -------------- ----------------------------

⚠ PRISMA + SUPABASE CRITICAL: You need TWO connection strings in .env.
DATABASE_URL uses the Supavisor session pooler (port 5432) with
pgbouncer=true for runtime queries. DIRECT_URL uses the direct
connection (port 5432 without pooler) for Prisma migrations only.
Without DIRECT_URL, prisma migrate dev will fail.

**2.2 Web Frontend Compatibility**

  ------------------ ------------- -------------- ----------------------------
  **Package /        **Version**   **Status**     **Notes**
  Layer**                                         

  Vite               5.x           **✓            Works perfectly with React
                                   Compatible**   18 and Tailwind 3

  React              18.x          **✓            Latest stable, full hooks
                                   Compatible**   support

  Tailwind CSS       3.4.x         **✓            Do NOT use Tailwind v4 ---
                                   Compatible**   it requires different setup
                                                  and breaks shadcn/ui

  shadcn/ui          latest        **✓            Requires Tailwind 3 and
                                   Compatible**   React 18. Works with Vite
                                                  via manual install

  Recharts           2.x           **✓            React 18 compatible, no
                                   Compatible**   issues

  Zustand            4.x           **✓            No peer dependency issues
                                   Compatible**   

  React Router       6.x           **✓            Use createBrowserRouter for
                                   Compatible**   role-based routing

  socket.io-client   4.x           **✓            Must match backend Socket.IO
                                   Compatible**   server version 4.x exactly

  Axios              1.x           **✓            No issues with React 18 or
                                   Compatible**   Vite

  Supabase JS SDK    2.x           **✓            Same package as backend,
                                   Compatible**   works identically in browser
  ------------------ ------------- -------------- ----------------------------

⚠ SHADCN/UI WITH VITE: shadcn/ui does not have a Vite template in its
CLI. You must run: npx shadcn-ui@latest init and choose \'Vite\'
manually. Do not skip the path alias setup (@/ pointing to src/) in
vite.config.js or components will not import correctly.

⚠ TAILWIND VERSION: Use Tailwind CSS v3.4.x not v4. Tailwind v4 has a
completely different config syntax that breaks shadcn/ui and most
existing Tailwind guides.

**2.3 Mobile Compatibility**

  ------------------------- ------------- -------------- ----------------------------
  **Package / Layer**       **Version**   **Status**     **Notes**

  Expo SDK                  51.x          **✓            Stable LTS release, full
                                          Compatible**   Expo Go support

  React Native              0.74.x        **✓            Ships with Expo 51, do not
                                          Compatible**   upgrade separately

  NativeWind                4.1.10        **⚠ Warning**  Pin to v4.1.10 exactly. Do
                                                         NOT use latest or v5
                                                         preview. See note below.

  Tailwind CSS (mobile)     3.4.x         **✓            Must match web version. Do
                                          Compatible**   not use v4.

  Expo Router               3.x           **✓            File-based routing, works
                                          Compatible**   with Expo 51

  react-native-reanimated   \~3.10.1      **✓            Pin to 3.10.x for Expo 51 +
                                          Compatible**   NativeWind 4 compatibility

  expo-location             \~17.x        **✓            GPS capture, works in Expo
                                          Compatible**   Go

  expo-image-picker         \~15.x        **✓            Camera + gallery, works in
                                          Compatible**   Expo Go

  expo-secure-store         \~13.x        **✓            Required for JWT storage on
                                          Compatible**   device

  react-native-maps         1.x           **⚠ Warning**  May not render in Expo Go
                                                         without dev build. Use as
                                                         fallback only.

  socket.io-client          4.x           **✓            Same package works in React
                                          Compatible**   Native

  expo-notifications        \~0.28.x      **⚠ Warning**  Requires custom dev build,
                                                         will NOT work in Expo Go.
                                                         Keep as P3.
  ------------------------- ------------- -------------- ----------------------------

⚠ NATIVEWIND CRITICAL: Pin NativeWind to exactly v4.1.10 in
package.json. Do not use \'latest\' or \'\^4.x\'. NativeWind v5 is in
preview and has a completely different setup. NativeWind v4 with Expo
SDK 51 has known build issues when newArchEnabled is set to true in
app.json --- keep new architecture disabled for the hackathon.

⚠ REACT-NATIVE-MAPS IN EXPO GO: Google Maps on the mobile app may not
render inside Expo Go without a custom development build. For the demo,
show the map view on the web admin dashboard instead, and keep the
mobile map screen as P3.

⚠ SUPABASE AUTH ON MOBILE: Supabase JS SDK uses localStorage by default
which does not exist in React Native. When initializing the Supabase
client in the mobile app, you MUST pass a custom storage adapter using
expo-secure-store. Without this, all auth will silently fail on the
mobile app.

⚠ EXPO ENVIRONMENT VARIABLES: Standard process.env does not work in
Expo. All environment variables must be prefixed with EXPO_PUBLIC\_ and
accessed via process.env.EXPO_PUBLIC_API_URL. Set this up on Day 1 or
all API calls will fail silently.

**2.4 Cross-Platform Compatibility Summary**

✓ Socket.IO v4 client works identically on web and React Native --- same
package, same code

✓ Supabase JS SDK v2 works identically on backend, web frontend, and
React Native

✓ Axios v1 works identically on web and React Native

✓ Zustand v4 works identically on web and React Native

✓ Prisma 5 + Supabase PostgreSQL officially supported combination

✓ Tailwind CSS 3 used on web and NativeWind 4 on mobile --- same class
names, consistent design

**3. System Architecture**

Three separate applications share one backend. The web app serves both
admin and citizen web users through role-based routing after login.

┌──────────────────────────────────────┐

│ BACKEND (Render) │

│ Node.js + Express + Prisma 5 │

│ Supabase PostgreSQL + Cloudinary │

│ Gemini API + Google Maps + Socket.IO │

└──────────┬───────────────────────────┘

│ REST API + Socket.IO

┌────────────────────┼────────────────────┐

│ │ │

┌─────────▼──────────┐ ┌───────▼────────────────────▼──────────┐

│ MOBILE APP │ │ WEB APP (Vercel) │

│ Expo SDK 51 │ │ Vite + React 18 + Tailwind + shadcn │

│ React Native │ │ │

│ NativeWind 4.1.10 │ │ Role-Based Routing after login: │

│ Expo Router v3 │ │ ├── CITIZEN role → /citizen/\* │

│ │ │ ├── ADMIN role → /admin/\* │

│ Citizen only │ │ └── DEPT_OFFICER role → /admin/\* │

└────────────────────┘ └────────────────────────────────────────┘

Expo Go for demo Single deployment on Vercel

**4. Backend --- Product Requirements**

**4.1 Tech Stack**

  --------------- --------------------- ----------------------------------
  **Layer**       **Technology**        **Purpose**

  Runtime         Node.js v20 LTS       Server runtime environment

  Framework       Express.js 4.18       REST API routing and middleware

  ORM             Prisma 5              Type-safe database access and
                                        migrations

  Database        Supabase (PostgreSQL) Cloud hosted relational database

  Auth            Supabase Auth         JWT-based auth --- OTP, Google,
                                        email/password

  Media           Cloudinary v2         Image upload, storage, URL
                                        delivery

  AI              Gemini 1.5 Flash API  Free API --- text + image
                                        complaint classification

  Geolocation     Google Maps Places    Geo-risk scoring for nearby
                  API                   sensitive locations

  Real-time       Socket.IO v4          Bidirectional real-time events

  Scheduler       node-cron v3          SLA breach monitoring cron job

  Validation      Zod v3                Request input validation

  Rate Limiting   express-rate-limit v7 Prevent API abuse and Gemini quota
                                        burns

  Deployment      Render                Cloud backend hosting with
                                        auto-deploy
  --------------- --------------------- ----------------------------------

**4.2 Folder Structure**

mgs-backend/

├── prisma/

│ └── schema.prisma ← Full database schema

├── src/

│ ├── index.js ← Express + Socket.IO entry point

│ ├── config/

│ │ ├── prisma.js ← Prisma client singleton

│ │ └── cloudinary.js ← Cloudinary config

│ ├── routes/

│ │ ├── auth.js ← /api/auth/\*

│ │ ├── complaints.js ← /api/complaints/\*

│ │ └── analytics.js ← /api/analytics/\*

│ ├── controllers/

│ │ ├── authController.js

│ │ ├── complaintController.js

│ │ └── analyticsController.js

│ ├── middleware/

│ │ ├── auth.js ← JWT verification via Supabase Admin SDK

│ │ ├── roles.js ← Role-based access control

│ │ ├── upload.js ← Multer image handling

│ │ ├── rateLimiter.js ← express-rate-limit config

│ │ ├── validate.js ← Zod input validation

│ │ └── errorHandler.js ← Global error handling middleware

│ ├── services/

│ │ ├── geminiService.js ← Gemini 1.5 Flash API calls

│ │ ├── geoService.js ← Google Maps geo-risk scoring

│ │ └── duplicateService.js← Duplicate complaint detection

│ └── jobs/

│ └── slaMonitor.js ← Cron job --- runs every 15 minutes

├── seed.js ← Demo data seeder (25-30 complaints)

├── .env

└── package.json

**4.3 Database Schema**

**User Table**

  ---------------- ------------- -------------- ----------------------------------
  **Field**        **Type**      **Required**   **Description**

  **id**           String (UUID) Yes            Auto-generated unique identifier

  **name**         String        Yes            Full name

  **email**        String        Yes            Unique email --- used for login

  **phone**        String?       No             Optional phone number

  **role**         Enum (Role)   Yes            CITIZEN \| ADMIN \| DEPT_OFFICER

  **department**   Enum?         No             Set for DEPT_OFFICER role only

  **points**       Int           Yes            Reward points --- default 0

  **createdAt**    DateTime      Yes            Auto timestamp
  ---------------- ------------- -------------- ----------------------------------

**Complaint Table**

  --------------------- ------------- -------------- ----------------------------------
  **Field**             **Type**      **Required**   **Description**

  **id**                String (UUID) Yes            Auto-generated unique identifier

  **title**             String        Yes            Short complaint title from citizen

  **description**       String        Yes            Full description text

  **category**          Enum          Yes            ROAD \| WATER \| GARBAGE \|
                        (Category)                   STREETLIGHT \| SANITATION \| OTHER

  **priority**          Int (1-10)    Yes            Gemini base score + geo-risk
                                                     bonus, capped at 10

  **status**            Enum (Status) Yes            SUBMITTED \| ASSIGNED \|
                                                     IN_PROGRESS \| RESOLVED \|
                                                     ESCALATED

  **imageUrl**          String?       No             Cloudinary secure URL

  **latitude**          Float         Yes            GPS latitude

  **longitude**         Float         Yes            GPS longitude

  **address**           String?       No             Human-readable address

  **department**        Enum          Yes            AI-assigned municipal department

  **slaDeadline**       DateTime?     No             Resolution deadline based on
                                                     priority

  **resolvedAt**        DateTime?     No             Timestamp when marked resolved

  **validationCount**   Int           Yes            Community validation count ---
                                                     default 0

  **isDuplicate**       Boolean       Yes            True if merged from a duplicate
                                                     report

  **parentId**          String?       No             Reference to original complaint if
                                                     duplicate

  **userId**            String        Yes            Foreign key to User

  **createdAt**         DateTime      Yes            Auto timestamp

  **updatedAt**         DateTime      Yes            Auto-updated on every change
  --------------------- ------------- -------------- ----------------------------------

**Enums**

  ---------------- ------------------------------------------------------
  **Enum Name**    **Values**

  Role             CITIZEN \| ADMIN \| DEPT_OFFICER

  Category         ROAD \| WATER \| GARBAGE \| STREETLIGHT \| SANITATION
                   \| OTHER

  Status           SUBMITTED \| ASSIGNED \| IN_PROGRESS \| RESOLVED \|
                   ESCALATED

  Department       ROADS_AND_INFRASTRUCTURE \| WATER_SUPPLY \|
                   SOLID_WASTE_MANAGEMENT \| STREET_LIGHTING \|
                   SANITATION
  ---------------- ------------------------------------------------------

**4.4 Environment Variables**

  ------------------------ ----------------------------------------------
  **Variable**             **Description**

  DATABASE_URL             Supavisor session pooler URL (port 5432) ---
                           for Prisma runtime queries

  DIRECT_URL               Direct Supabase DB URL --- for Prisma
                           migrations only

  SUPABASE_URL             Your Supabase project URL

  SUPABASE_SERVICE_KEY     Supabase service role key for admin SDK token
                           verification

  CLOUDINARY_CLOUD_NAME    Cloudinary account cloud name

  CLOUDINARY_API_KEY       Cloudinary API key

  CLOUDINARY_API_SECRET    Cloudinary API secret

  GEMINI_API_KEY           Free API key from aistudio.google.com

  GOOGLE_MAPS_API_KEY      Google Maps Places API key

  PORT                     Server port --- default 5000

  CLIENT_URL               Frontend Vercel URL for CORS whitelist
  ------------------------ ----------------------------------------------

**4.5 API Endpoints**

**Authentication**

  ------------ --------------------- ---------- ----------------------------------
  **Method**   **Endpoint**          **Auth**   **Description**

  **POST**     /api/auth/register    Public     Register citizen with name, email,
                                                password

  **POST**     /api/auth/login       Public     Login and receive JWT session
                                                token

  **GET**      /api/auth/me          Auth       Get current logged-in user with
                                                role

  **POST**     /api/auth/logout      Auth       Invalidate current session
  ------------ --------------------- ---------- ----------------------------------

**Complaints**

  ------------ ------------------------------ --------------- ----------------------------------
  **Method**   **Endpoint**                   **Auth**        **Description**

  **POST**     /api/complaints                Citizen         Submit complaint --- triggers full
                                                              AI pipeline

  **GET**      /api/complaints                Admin/Officer   Get all complaints with filters

  **GET**      /api/complaints/my             Citizen         Get current citizen\'s own
                                                              complaints

  **GET**      /api/complaints/:id            Auth            Get single complaint detail

  **PATCH**    /api/complaints/:id/status     Admin/Officer   Update complaint status

  **POST**     /api/complaints/:id/validate   Citizen         Community validate a nearby
                                                              complaint --- awards +5 points
  ------------ ------------------------------ --------------- ----------------------------------

**Analytics**

  ------------ ---------------------------- ---------- ----------------------------------
  **Method**   **Endpoint**                 **Auth**   **Description**

  **GET**      /api/analytics/overview      Admin      Total, open, in-progress,
                                                       resolved, SLA breach counts

  **GET**      /api/analytics/departments   Admin      Per-department metrics ---
                                                       resolved, pending, avg time, SLA %

  **GET**      /api/analytics/heatmap       Admin      Complaint GPS coordinates grouped
                                                       by zone for map display

  **GET**      /api/analytics/trends        Admin      Complaint volume over time by
                                                       category
  ------------ ---------------------------- ---------- ----------------------------------

**4.6 Core Backend Flows**

**Complaint Submission Flow (Most Critical)**

1.  Auth middleware verifies JWT and attaches user ID and role to
    request

2.  Multer processes multipart form, uploads image to Cloudinary, stores
    secure URL

3.  Duplicate check --- query DB for same category complaints within
    100m radius

4.  If duplicate found --- increment validationCount on original, award
    citizen points, return merged response

5.  Gemini 1.5 Flash API receives description + image URL + GPS ---
    returns category, base priority (1-10), department

6.  Google Maps Places API checks for hospitals, schools, police
    stations within 500m --- adds geo-risk bonus points

7.  Final priority = Gemini base + geo-risk bonus, capped at 10

8.  SLA deadline calculated --- Critical(9-10)=6hrs, High(7-8)=24hrs,
    Medium(4-6)=48hrs, Low(1-3)=72hrs

9.  Prisma saves complete complaint record to Supabase with all
    processed fields

10. Socket.IO emits new-complaint event to admin-room and
    dept-{DEPARTMENT} room

11. 201 response returned to client with full complaint object including
    AI classification

**Geo-Risk Scoring**

  --------------------- ---------- ------------ ------------------------------
  **Nearby Location**   **Bonus    **Radius**   **Reason**
                        Points**                

  Hospital / Clinic     +3         500m         Critical infrastructure,
                                                patient safety at risk

  School / College      +2         300m         High footfall, child safety
                                                concern

  Police Station        +2         300m         Emergency access must not be
                                                blocked

  Major Intersection    +1         200m         High traffic density, accident
                                                risk

  No sensitive          +0         ---          Standard priority maintained
  locations                                     
  --------------------- ---------- ------------ ------------------------------

**SLA Monitoring Cron Job**

-   Runs every 15 minutes using node-cron

-   Queries all complaints where slaDeadline \< now AND status !=
    RESOLVED

-   Updates status to ESCALATED for each breached complaint via Prisma

-   Emits sla-breach Socket.IO event to admin-room with complaint
    details

-   Logs breach in analytics for department performance tracking

**Socket.IO Event Map**

  ------------------- --------------- ------------------ ---------------------------
  **Event**           **Direction**   **Room**           **Trigger**

  new-complaint       Server → Client admin-room         New complaint submitted by
                                                         citizen

  complaint-updated   Server → Client complaint-{id}     Status changed by admin or
                                                         officer

  sla-breach          Server → Client admin-room         Complaint deadline passed
                                                         unresolved

  new-assignment      Server → Client dept-{DEPT_NAME}   Complaint routed to
                                                         department
  ------------------- --------------- ------------------ ---------------------------

**4.7 Middleware Stack**

-   **rateLimiter.js --- 10 requests/min per IP on complaint submission,
    prevents Gemini quota burn**

-   auth.js --- Extracts Bearer token, verifies via Supabase Admin SDK,
    attaches req.user

-   roles.js --- Checks req.user.role, returns 403 if insufficient
    permissions

-   upload.js --- Multer parses multipart/form-data, validates image
    type and 5MB size limit

-   validate.js --- Zod schema validation on request body, returns 400
    with clear error messages

-   errorHandler.js --- Global catch-all, returns clean JSON errors,
    prevents raw stack traces leaking

**4.8 Backend Build Priority**

**Tier 1 --- Must Have (Days 1-2)**

-   **Express server, CORS, dotenv, basic project structure**

-   **Prisma schema migration to Supabase with both DATABASE_URL and
    DIRECT_URL configured**

-   **Supabase Auth JWT verification middleware**

-   **Complaint submission --- Cloudinary upload + Gemini
    classification**

-   **Basic complaint GET endpoints for citizen and admin**

**Tier 2 --- Should Have (Days 3-4)**

-   **Socket.IO setup with all rooms and events**

-   **Status update endpoint with real-time emit**

-   **Geo-risk scoring with Google Maps Places API**

-   **SLA deadline calculation and storage**

-   **Analytics overview and department endpoints**

-   **Rate limiting and Zod validation on all endpoints**

-   **Global error handler middleware**

**Tier 3 --- Nice to Have (Day 5 if time permits)**

-   **Duplicate detection and complaint merging**

-   **Community validation endpoint and reward points**

-   **SLA cron job with auto-escalation**

-   **Seed data script with 25-30 realistic complaints**

**5. Web Application --- Product Requirements**

The web application is a single React app deployed on Vercel. After
login, it uses role-based routing to direct users to the correct
experience. Citizens get the citizen portal. Admins and department
officers get the admin dashboard. No separate deployments needed.

**5.1 Tech Stack**

  ------------------ ------------- ----------------------------------------
  **Tool**           **Version**   **Purpose**

  Vite               5.x           Build tool and dev server --- fast HMR

  React              18.x          UI framework with hooks

  Tailwind CSS       3.4.x         Utility-first styling --- use v3 NOT v4

  shadcn/ui          latest        Pre-built accessible UI components

  React Router       6.x           Client-side routing with role-based
                                   redirects

  Zustand            4.x           Global state management

  Axios              1.x           HTTP client with JWT interceptor

  Supabase JS SDK    2.x           Auth state and session management

  socket.io-client   4.x           Real-time events from backend

  Recharts           2.x           Analytics charts and trends

  Google Maps React  latest        Heatmap and location markers
  ------------------ ------------- ----------------------------------------

**5.2 Role-Based Routing Architecture**

After login, the app checks the user\'s role from Supabase session and
redirects accordingly. This is the core mechanism that enables both
citizens and admins to use the same web app.

/ (root)

├── /login Public

├── /register Public

│

├── /citizen/\* Protected --- CITIZEN role only

│ ├── /citizen/home Home dashboard with stats and quick report

│ ├── /citizen/report Submit new complaint

│ ├── /citizen/complaints My complaints list

│ ├── /citizen/complaints/:id Complaint detail with status tracker

│ └── /citizen/rewards Points, badges, leaderboard

│

└── /admin/\* Protected --- ADMIN or DEPT_OFFICER role only

├── /admin/dashboard Overview stats, heatmap, high priority alerts

├── /admin/complaints Complaint management table with filters

├── /admin/complaints/:id Complaint detail with status update

├── /admin/analytics Department performance, trends, AI insights

└── /admin/heatmap Full city complaint heatmap

**How it works:**

-   User logs in → Supabase returns session with user metadata including
    role

-   AuthGuard component wraps all protected routes --- reads role from
    Zustand auth store

-   Role CITIZEN → redirect to /citizen/home

-   Role ADMIN or DEPT_OFFICER → redirect to /admin/dashboard

-   Attempting to access wrong role\'s routes → redirect back to correct
    home

**5.3 Citizen Web Portal Screens**

**Home Screen (/citizen/home)**

-   Welcome header with citizen name

-   Three stat cards --- Total Complaints, Resolved, Reward Points

-   Large Report New Issue button --- navigates to /citizen/report

-   Recent Complaints list --- last 3 complaints with status badges,
    updates in real time via Socket.IO

**Submit Complaint (/citizen/report)**

-   Photo upload input with preview --- accepts jpg/png/webp up to 5MB

-   Browser Geolocation API for automatic GPS capture with address
    display

-   Category selector --- 6 options with icons

-   Title and description text fields --- description minimum 20
    characters

-   Submit button with loading state while backend AI pipeline processes

-   Success card showing complaint ID, AI-assigned category, priority
    score, department, and SLA deadline

-   If duplicate --- friendly message showing merged status and points
    awarded

**My Complaints (/citizen/complaints)**

-   Full list of citizen\'s complaints, newest first

-   Each card --- category icon, title, date submitted, status badge,
    priority badge

-   Status badge updates in real time via Socket.IO

-   Click card to open complaint detail

**Complaint Detail (/citizen/complaints/:id)**

-   Full complaint info --- photo, description, location, category,
    priority

-   Visual status stepper --- Submitted, Assigned, In Progress, Resolved
    --- current step highlighted

-   SLA information --- expected resolution date and time remaining

-   Google Maps embed showing GPS complaint location

-   Live status stepper updates via Socket.IO when admin changes status

**Rewards (/citizen/rewards)**

-   Total points display with level badge

-   Progress bar toward next level

-   This month\'s activity --- Reported, Validated, Resolved counts

-   Badges earned --- First Reporter, Community Hero, Active Citizen

**5.4 Admin Dashboard Screens**

**Dashboard Overview (/admin/dashboard)**

-   **Stat cards --- Total, Open, In Progress, Resolved, SLA Breaches
    --- all update via Socket.IO**

-   **City Complaint Heatmap using Google Maps --- complaint density by
    zone**

-   **High Priority Alerts panel --- complaints with priority 8+ needing
    immediate attention**

-   **Recent Activity feed --- live feed of latest 5 complaint updates
    via Socket.IO**

-   **Department SLA compliance summary bar chart using Recharts**

**Complaint Management (/admin/complaints)**

-   Full table --- Photo, ID, Type, Location, AI Priority badge, Status
    badge, SLA status, Actions

-   Filter bar --- Status, Department, Priority range, Date range

-   Search by complaint ID, type, or location

-   Action buttons --- View, Assign, Resolve per row

-   New complaints appear in real time at top of table via Socket.IO

-   Color-coded SLA column --- On Track (green), Warning (orange),
    Breach (red)

**Complaint Detail (/admin/complaints/:id)**

-   Full complaint info with photo, AI classification panel showing
    Gemini reasoning

-   Status update dropdown --- admin changes status with one click

-   SLA countdown timer or time-since-breach display

-   Google Maps showing exact GPS location

-   Validation count --- community confirmations

-   Status timeline showing full history

**Performance Analytics (/admin/analytics)**

-   Department performance table --- Total, Resolved, Pending, Avg Time,
    SLA Compliance %

-   Performance ratings --- Excellent, Good, Needs Improvement

-   Line chart --- complaint volume trends over 30 days

-   Bar chart --- complaints by category

-   AI Insights panel --- cluster detection, predictive SLA breach
    alerts, trend analysis

**6. Mobile App --- Product Requirements**

The mobile app is built with Expo SDK 51 and React Native. It targets
Android for the demo via Expo Go. It covers only the citizen experience
--- admins use the web app. Both apps share the same backend.

**6.1 Tech Stack**

  ------------------------- ------------- ----------------------------------------
  **Tool**                  **Version**   **Purpose**

  Expo SDK                  51.x          Managed workflow --- instant testing via
                                          Expo Go

  React Native              0.74.x        Cross-platform mobile --- ships with
                                          Expo 51

  NativeWind                4.1.10        Tailwind classes for React Native ---
                                          pin this version exactly

  Tailwind CSS              3.4.x         Required peer dependency for NativeWind

  Expo Router               3.x           File-based routing for React Native

  react-native-reanimated   \~3.10.1      Animations --- pin to 3.10.x for
                                          NativeWind 4 compatibility

  expo-location             \~17.x        GPS coordinate capture

  expo-image-picker         \~15.x        Camera and gallery access

  expo-secure-store         \~13.x        Secure JWT storage --- required for
                                          Supabase auth

  socket.io-client          4.x           Real-time updates from backend

  Axios                     1.x           HTTP client with JWT interceptor

  Zustand                   4.x           Global state management
  ------------------------- ------------- ----------------------------------------

**6.2 Critical Mobile Setup Steps (Do on Day 1)**

-   **Initialize with: npx create-expo-app mgs-mobile \--template
    blank**

-   **Install NativeWind: npx expo install nativewind@4.1.10
    tailwindcss@3.4.x react-native-reanimated@\~3.10.1**

-   **Set EXPO_PUBLIC\_ prefix on all environment variables in .env**

-   **Initialize Supabase client with expo-secure-store custom storage
    adapter --- without this auth silently fails**

-   **Disable new architecture in app.json --- newArchEnabled: false for
    NativeWind 4 compatibility**

**6.3 Mobile Screens**

**Onboarding --- 3 slides shown on first launch only**

-   Slide 1 --- Report: Take a photo of any civic issue

-   Slide 2 --- Track: See real-time status of your complaint

-   Slide 3 --- Earn: Get points for active civic participation

-   Skip button and Get Started button leading to login

**Login & Register**

-   Email + password login with form validation

-   Register with name, email, phone, password

-   Google OAuth via Supabase Auth

-   OTP phone login via Supabase Auth

-   JWT stored securely via expo-secure-store

**Home Tab**

-   Welcome header with citizen name and notification bell

-   Stats row --- Total Complaints, Resolved, Points

-   Large Report New Issue CTA button

-   Recent Complaints list --- last 3 with live status badges via
    Socket.IO

**Submit Complaint Tab**

-   Camera launch via expo-image-picker with photo preview

-   GPS capture via expo-location with address display

-   Category selector --- 6 category cards with icons

-   Title and description input with character counter

-   Submit with loading state during backend processing

-   Success screen with complaint ID, AI results, SLA deadline

**My Complaints Tab**

-   Full complaint list newest first

-   Category icon, title, date, status badge, priority badge per card

-   Real-time status badge updates via Socket.IO

-   Pull to refresh

**Complaint Detail Screen**

-   Full info --- photo, description, location, category, priority

-   Visual status stepper with current step animated

-   SLA info --- expected resolution date

-   Live stepper update via Socket.IO

**Rewards Tab**

-   Total points and level display

-   Progress bar to next level

-   Monthly stats --- Reported, Validated, Resolved

-   Badges section --- earned and locked badges

-   Nearby complaints to validate list --- complaints within 500m

-   Validate button per complaint --- calls backend, awards +5 points
    instantly

**7. Shared Code Layer --- Web & Mobile**

These files can be shared between web and mobile to avoid duplicating
API calls, constants, and Socket.IO setup.

shared/

├── api/

│ ├── axios.js ← Base instance with JWT interceptor and 10s timeout

│ ├── authApi.js ← login, register, logout, getMe

│ ├── complaintsApi.js ← submit, getAll, getMy, getById, updateStatus,
validate

│ └── analyticsApi.js ← overview, departments, heatmap, trends

├── constants/

│ ├── categories.js ← Category enum values, display names, icons

│ ├── departments.js ← Department names and category mapping

│ └── status.js ← Status enums and color codes

└── socket/

└── socketClient.js ← Socket.IO setup, room join logic, event handlers

**Axios Interceptor Must Include:**

-   10 second timeout on every request --- prevents hanging during poor
    hackathon WiFi

-   Auto-attach Supabase JWT Bearer token on every request

-   Auto-refresh token on 401 response

-   Show user-friendly toast error on network failure

**8. 5-Day Build Plan**

  --------- --------------------- --------------------- ---------------------
  **Day**   **Backend**           **Web Frontend**      **Mobile**

  Day 1     Project setup, Prisma Vite + Tailwind +     Expo init, NativeWind
            schema migration,     shadcn setup, Login   4.1.10 setup,
            Supabase Auth         page, AuthGuard, role Supabase custom
            middleware, CORS, env routing skeleton      storage adapter,
            config                                      Login screen

  Day 2     Complaint submission  Admin dashboard stat  Home tab, Submit
            --- Cloudinary +      cards (static),       complaint with
            Gemini classification Complaint table with  camera + GPS, My
            working end to end    dummy data, Citizen   complaints list
                                  home and report       screen
                                  screen                

  Day 3     Socket.IO rooms,      Connect all screens   Connect mobile to
            status update         to real APIs,         real APIs, Socket.IO
            endpoint, geo-risk    Socket.IO on web      on mobile, complaint
            scoring, analytics    (admin room), Google  detail with stepper
            endpoints             Maps heatmap          

  Day 4     Rate limiting, Zod    Admin complaint       Rewards screen,
            validation, error     detail, analytics     community validation,
            handler, SLA cron     charts with Recharts, badge display, live
            job, duplicate        citizen complaint     status updates
            detection             detail live updates   

  Day 5     Seed script --- 25-30 Final bug fixes,      Fix critical bugs,
            realistic complaints  deploy to Vercel,     test Expo Go demo on
            across all statuses.  confirm role routing  real Android phone,
            Deploy to Render.     works end to end      rehearse demo flow
  --------- --------------------- --------------------- ---------------------

**9. Target Demo Flow --- Two Device Setup**

Run the demo with a laptop (web app) and an Android phone (Expo Go
mobile app) side by side. This demonstrates real-time capability
visually and is the most impressive setup for judges.

12. Open admin dashboard on laptop browser --- show seeded complaints,
    heatmap, SLA stats

13. Open Expo Go on Android phone --- login as citizen account

14. On phone --- navigate to Submit Complaint, take a photo of a
    pothole, GPS auto-captured

15. Enter description: \'Large pothole on main road near school entrance
    causing accidents\'

16. Tap Submit --- show loading state while Gemini processes

17. Success screen appears --- ROAD category, Priority 9, ROADS dept,
    SLA 6 hours

18. On laptop --- new complaint appears instantly at top of admin table
    without refresh (Socket.IO)

19. Admin clicks complaint --- sees AI classification panel with
    Gemini\'s reasoning

20. Admin changes status to In Progress --- clicks update

21. On phone --- complaint status badge changes to In Progress in real
    time (Socket.IO)

22. Admin marks complaint as Resolved

23. On phone --- status shows Resolved, reward points increment

24. Switch to Analytics tab on laptop --- show department performance,
    SLA compliance, trend chart

**Total demo time: approximately 2 minutes. Every core feature
demonstrated. No slides needed during this section --- the live product
speaks for itself.**

**10. Anticipated Judge Questions & Answers**

  ---------------------------- ------------------------------------------
  **Question**                 **Answer**

  Did you train a custom ML    No --- we use Google Gemini 1.5 Flash, a
  model?                       pretrained multimodal model, with custom
                               prompt engineering for classification.
                               This is a more production-ready approach
                               than a small custom model trained on
                               limited data.

  How is this different from   CPGRAMS is a text-only submission portal
  CPGRAMS?                     with manual routing. Our system adds AI
                               visual classification, geo-risk priority
                               scoring, duplicate merging, community
                               validation, real-time Socket.IO updates,
                               and an incentive model --- none of which
                               CPGRAMS has.

  How does the AI classify     We send the complaint text, photo URL, and
  complaints?                  GPS coordinates to Gemini 1.5 Flash with a
                               structured prompt defining strict category
                               enums and a priority rubric. It returns
                               clean JSON with category, priority score,
                               department, and reasoning.

  What happens if Gemini API   The geminiService has a fallback that
  is down?                     returns default values --- category OTHER,
                               priority 5 --- so the complaint is still
                               submitted successfully. The system
                               degrades gracefully without crashing.

  How do you prevent false     Three mechanisms --- community validation
  complaints?                  by nearby citizens, duplicate detection
                               that merges similar nearby reports, and
                               the reward points model that incentivizes
                               only valid submissions.

  Is this scalable?            The architecture is horizontally scalable
                               --- backend on Render can scale
                               containers, Supabase handles connection
                               pooling via Supavisor, Cloudinary scales
                               media delivery via CDN, and Socket.IO
                               supports clustering with Redis adapter for
                               multi-server deployments.
  ---------------------------- ------------------------------------------

**Built with 🔥 by alphaCode --- HackGenX 2026**

Sandip Institute of Technology & Research Centre, Nashik, Maharashtra