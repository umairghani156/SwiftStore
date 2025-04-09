# Building Management System (BMS)

## **Overview**
The **Building Management System (BMS)** is a comprehensive platform designed to manage visitor entry, office visits, issue reporting, and security operations in a large-scale building. It provides **real-time visitor tracking, digital token generation, problem reporting, role-based access control, and mobile administrative tools** for effective management.

## **Features**
### **1. Visitor Management**
- Tracks visitor check-ins and check-outs.
- Generates a **printed visitor token** with name, contact, office to visit, and expected visit duration.
- Smart **QR-based entry system** for quick verification.
- Digital visitor log accessible by administrators and security personnel.
- Real-time statistics on visitor flow.

### **2. Problem Reporting System**
- Tenants and visitors can report issues in the building.
- Categorized problem reports (e.g., Electrical, Plumbing, Security, Maintenance).
- Live issue tracking with statuses: **Pending, In Progress, Resolved**.
- Admins and office managers can assign issues to appropriate teams.

### **3. Stakeholder Management**
- **Admin:** Manages visitors, tenants, security personnel, and building statistics.
- **Office Managers:** View visitor stats, approve/reject appointments, and manage office-specific reports.
- **Security Guards:** Scan visitor tokens for verification and monitor access control.
- **Tenants:** Report building issues and request visitor appointments.

### **4. Real-Time Dashboard**
- Displays **total visitor count** and office-wise visit distribution.
- Real-time **heatmap of visitor movement**.
- **Daily, weekly, and monthly** visitor analytics.
- Alerts for **high footfall areas** to optimize space management.

### **5. Mobile App for Administrators**
- **Live visitor stats & building occupancy.**
- **Push notifications** for emergency alerts and issue updates.
- **Approve/reject visitor requests** on the go.
- **Report & resolve issues** directly from the app.

## **Innovative Features**
### **1. Smart QR-Based Entry System**
- Each visitor receives a **unique QR code** for seamless entry and exit.
- Automated **smart gate access** for pre-approved visitors.
- QR scanning logs visitor entry and exit in real-time.

### **2. AI-Based Visitor Prediction**
- Uses past visitor data to predict **peak hours and office trends**.
- Office managers receive notifications about **expected high footfall**.
- **Optimized scheduling** for visitor flow management.

### **3. IoT-Enabled Smart Access**
- **Smart locks for office doors** authenticate visitors via QR codes.
- **Automated lighting & climate control** based on room occupancy.

### **4. Emergency Alert System**
- **Panic button feature** for emergency situations.
- Instant notifications sent to **building security & administrators**.
- **Live tracking** of emergency response team deployment.

### **5. Real-Time Heatmap of Visitor Density**
- Tracks **visitor movement & density** inside the building.
- Helps in **efficient crowd management** and **space optimization**.
- Reduces **overcrowding risks** by predicting peak times.

## **Technology Stack**
### **Frontend**
- **React.js / Next.js** (Admin Panel & Web Dashboard)
- **Tailwind CSS** for responsive UI

### **Backend**
- **Node.js with Express / Nest.js** (RESTful APIs & Authentication)
- **PostgreSQL / MongoDB** (Visitor & Office Data Storage)
- **Firebase Auth / JWT** (User Authentication & Access Control)

### **Mobile App**
- **React Native** (Administrator & Security App)
- **Push Notifications** for alerts and updates

## **API Endpoints**
### **Visitor Management**
- `POST /api/visitors/register` – Register a new visitor.
- `GET /api/visitors/list` – Get a list of all visitors.
- `GET /api/visitors/:id` – Get visitor details.
- `DELETE /api/visitors/:id` – Remove a visitor.

### **Issue Reporting**
- `POST /api/issues/report` – Report an issue.
- `GET /api/issues` – List all reported issues.
- `PATCH /api/issues/:id` – Update issue status.

### **Dashboard & Analytics**
- `GET /api/analytics/visitors` – Get visitor statistics.
- `GET /api/analytics/heatmap` – Get real-time heatmap data.

## **Future Enhancements**
- **Facial Recognition Entry System** for added security.
- **Integration with AI-powered chatbots** for visitor support.
- **Advanced data visualization** with interactive charts.
- **Multi-building support** for managing multiple locations.

## **License**
This project is licensed under the **SIT License**.

## **Contact**
For any queries, please reach out to **[attari1235@gmail.com]** 

