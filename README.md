# 🛡️ Admin Panel – Task 4 Submission

A full-stack user management system built for the **Task #4**. The system allows registration, login, and admin-level operations like bulk blocking, unblocking, and deleting users with automatic logout handling.

---

## 👩‍💻 Developed By

**Maliha Sultana**

---

## ⚙️ Technologies Used

### 🚀 Frontend
- React.js
- React Router DOM
- Axios
- React Icons
- React Toastify
- Chart.js
-  Bootstrap

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- CORS, bcryptjs

##  Deployment Links

- **Frontend (Vercel):**[(https://user-management-system-seven-sable.vercel.app/)]


##  Features Demonstrated

###  Authentication
-  User Registration
-  User Login 
-  LocalStorage session management

###  Admin Panel (Protected Routes)
-  View all users with login status
-  Bulk select users
-  Block/unblock/delete selected users
-  Prevent blocking self without auto-logout
-  Auto logout if admin blocks themselves
- "Last login" bar chart for each user

### 🔄 Backend Logic
-  Duplicate email error handling using **MongoDB unique index**
-  Returns user-friendly error on duplicate
-  No manual check for existing email before insertion

## How to Run Locally

### Frontend
```bash
cd client
npm install
npm run dev
