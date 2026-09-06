# 📱 Placement Tracker

An offline Android application designed to help students organize and manage their placement applications, company information, application status, and important placement-related reminders.

The application is built using **HTML, CSS, JavaScript, and Capacitor**, and packaged as a native Android application.

---

## 🎯 Project Overview

Students often apply to multiple companies during placement season and need to keep track of:

- Companies they have applied to
- Application dates
- Selection status
- Important PPT dates
- Examination dates
- Other placement-related events

Managing all of this information manually can become difficult.

**Placement Tracker** provides a simple offline solution where students can store their placement information and receive reminders at the required date and time.

---

## ✨ Features

### 🏢 Company Tracking

Add companies to the placement tracker with:

- Company name
- Application date
- Application status

Companies are automatically arranged according to their application date, with the newest applications displayed first.

---

### 📊 Application Status

Each company can have one of three statuses:

- 🟢 Accepted
- 🟡 Pending
- 🔴 Rejected

The dashboard provides a quick overview of the number of companies in each status.

---

### 🗑️ Delete Companies

Companies can be removed from the tracker whenever they are no longer required.

Deleting a company also removes it from the **My Companies** section.

---

### ⭐ My Companies

Important companies can be maintained in the **My Companies** section for easier access.

---

### 🔔 Offline Reminders

The application supports reminders for important placement events such as:

- PPT
- Online assessments
- Coding tests
- Interviews
- Examinations

Reminders are scheduled using Android local notifications.

The application does not require an internet connection to trigger scheduled reminders.

---

### 📅 Date and Time Management

Each reminder contains:

- Company
- Reminder type
- Date
- Time

Reminders are displayed chronologically according to their scheduled date and time.

---

### 💾 Offline Data Storage

Placement information and reminders are stored locally on the device.

The application does not require a backend server or database for its core functionality.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | User interface and styling |
| JavaScript | Application logic |
| Capacitor | Converts web application into native Android application |
| Android | Mobile application platform |
| LocalStorage | Offline data storage |
| Capacitor Local Notifications | Scheduled Android notifications |
| Gradle | Android build system |

---

## 🏗️ Application Architecture

```text
                Placement Tracker
                       │
                       ▼
              HTML / CSS / JavaScript
                       │
                       ▼
                 Capacitor
                       │
          ┌────────────┴────────────┐
          ▼                         ▼
    LocalStorage              Local Notifications
          │                         │
          ▼                         ▼
   Company & Reminder          Android System
        Data                   Notifications
          │
          ▼
       Android APK


📱 Application Workflow
User
 │
 ├── Add Company
 │      │
 │      ├── Company Name
 │      ├── Application Date
 │      └── Status
 │
 ├── View Companies
 │      │
 │      ├── Sort by Date
 │      ├── Search
 │      └── Filter by Status
 │
 ├── My Companies
 │
 └── Add Reminder
        │
        ├── Company
        ├── Reminder Type
        ├── Date
        └── Time
               │
               ▼
       Android Notification

🔔 Reminder System

The reminder system uses Capacitor Local Notifications.

When a reminder is created:

User selects date & time
          ↓
JavaScript creates reminder
          ↓
Reminder stored in LocalStorage
          ↓
Capacitor Local Notifications
          ↓
Android schedules notification
          ↓
Notification appears at scheduled time

The notification is handled by Android, so the application does not need to remain open for the scheduled notification.

💾 Data Storage

The application uses browser LocalStorage through the Capacitor WebView.

The following data is stored locally:

companies
myCompanies
reminders

This allows the application to work without a backend server.

📦 Installation
Option 1: Install APK

Download the APK from the project's release section or build it locally.

Install:

app-debug.apk

on an Android device.

💻 Development Setup
Requirements

Install:

Node.js
npm
Git
Android Studio
Android SDK
Clone the Repository
git clone https://github.com/Tharun-vadlamudi/placement-tracker-apk.git

Move into the project:

cd placement-tracker-apk
Install Dependencies
npm install
Sync Capacitor
npx cap sync android
Open Android Studio
npx cap open android
Build APK

Inside Android Studio:

Build
   ↓
Generate App Bundles or APKs
   ↓
Generate APKs

The generated APK can be found under:

android/app/build/outputs/apk/debug/
🔐 Permissions

The application uses Android notification functionality to schedule placement reminders.

The Android project includes the required exact-alarm permission for scheduled notifications.

🌐 Offline Support

One of the main goals of the project is to keep the core functionality available without internet access.

The application stores data locally and uses Android's notification system for reminders.

Internet is therefore not required for normal company tracking and scheduled reminder functionality after installation.

🚀 Future Improvements

Possible future enhancements include:

☁️ Cloud synchronization
🔐 User authentication
📊 Advanced placement analytics
📤 Export placement data
📥 Import placement data
🔄 Backup and restore
🏢 Company-wise statistics
📈 Placement progress charts
🔔 Full alarm-style reminders
🎨 Theme customization
🎓 Project Purpose

This project was developed as a practical mobile application to simplify placement preparation and application management for students.

It demonstrates how a web-based frontend can be converted into a native Android application using Capacitor while maintaining offline functionality.

