# 🔐 Admin User Management Guide

## 📍 **Where to Find User Management:**

### **Settings Page Location:**

Navigate to: **Admin Dashboard → Settings**

- URL: `/admin/settings`
- Or click the "Settings" card from your admin dashboard

---

## 🔑 **Change Your Password:**

### **Step 1: Access Password Settings**

1. Go to `/admin/settings`
2. Look for the "Change Password" section
3. Click **"Change Password"** button

### **Step 2: Change Password Form**

Fill out the form:

- **Current Password**: Your existing password
- **New Password**: Must be at least 6 characters
- **Confirm New Password**: Must match the new password

### **Step 3: Save Changes**

- Click **"Save Password"**
- You'll see a success message when completed

---

## 👥 **Create New Admin Users:**

### **Step 1: Access User Management**

1. Go to `/admin/settings`
2. Look for the "User Management" section
3. Click **"Add User"** button

### **Step 2: Create User Form**

Fill out the form:

- **Email Address**: The new admin's email
- **Password**: Must be at least 6 characters

### **Step 3: Create User**

- Click **"Create User"**
- The new admin can now login with these credentials

---

## 🗑️ **Delete Admin Users:**

### **Important Safety Features:**

- ✅ Cannot delete your own account
- ✅ Cannot delete the last admin user
- ✅ Confirmation dialog before deletion

### **How to Delete:**

1. In the "User Management" section
2. Find the user you want to remove
3. Click the red **trash icon**
4. Confirm the deletion

---

## 📊 **Current Features Available:**

### ✅ **Password Management**

- Change your own password securely
- Requires current password verification
- Minimum 6 character requirement

### ✅ **User Management**

- View all admin users
- Create new admin accounts
- Delete admin accounts (with safety checks)
- See user creation dates

### ✅ **Security Features**

- Session-based authentication
- Password hashing with bcrypt
- Proper authorization checks
- Prevent self-deletion
- Prevent deleting last admin

---

## 🚀 **Quick Access:**

**Direct URL**: `/admin/settings`

**From Dashboard**:

1. Login to admin
2. Go to main dashboard
3. Click "Settings" card
4. Manage users and passwords

---

## 🔒 **Security Best Practices:**

1. **Use Strong Passwords**: At least 8+ characters with mixed case, numbers, symbols
2. **Change Default Password**: If using the default `admin123`, change it immediately
3. **Limit Admin Users**: Only create accounts for people who need admin access
4. **Regular Password Updates**: Change passwords periodically

Your admin user management system is now fully functional! 🎉
