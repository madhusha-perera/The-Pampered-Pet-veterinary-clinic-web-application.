
# 🐾 The Pampered Pet – Veterinary Clinic Web Application

A responsive, full-featured web-based veterinary clinic management platform that enables pet owners, veterinarians, and clinic staff to interact through role-specific dashboards. Built using vanilla HTML, CSS, and JavaScript with localStorage-based persistence.

---

## 🌐 Live Demo (Optional)
> _If hosted, provide a link here._

---

## 📁 Project Structure

```
📦 pampered-pet/
├── index.html               # Landing page
├── about.html               # About the clinic and charity work
├── team.html                # Team showcase with filter and modal
├── services.html            # Filterable list of services
├── contact.html             # Contact form + Google Maps
├── donate.html              # Donation options
├── payment.html             # Mock payment form
├── RBCP.html                # Role-based dashboard and portal (Login, Owner, Vet, Reception)
├── css/
│   ├── style.css            # Shared styling
│   └── RBCP.css             # Dashboard-specific styling
├── js/
│   ├── script.js            # Front-facing logic (forms, modal, filter)
│   └── RBCP.js              # All backend dashboard logic
├── images/                  # Banners, team photos, logo, icons
├── vids/                    # Background videos
├── data/
│   └── services.json        # (Referenced in `script.js` for AJAX service loading)
```

---

## ✨ Features

### ✅ General Website
- Hero section with image and intro text
- About + Charity impact gallery
- Dynamic **Team page** with modal & search
- Filterable **Services** list via AJAX
- Fully styled **Contact page** with form validation and Google Maps

### ✅ Donation & Payment Flow
- Preset and custom donation inputs
- Basic card form with field validation
- Front-end only (no real payment gateway)

### ✅ RBCP (Role-Based Control Panel)
A full single-page app experience with:
- 👤 **Owner Panel**:
  - Signup/Login
  - Register Pets
  - Make Appointments
  - View Pets & Medical Records

- 🧑‍⚕️ **Vet Panel**:
  - View Assigned Appointments
  - Search/View Pets
  - Add Medical Records

- 🧑‍💼 **Receptionist / Head Receptionist Panel**:
  - CRUD for Owners, Vets, Pets, Appointments, Receptionists (admin only)
  - View Pet Records

- Dynamic ID generation (`OWN-0001`, `PET-0001`, etc.) using `localStorage`

---

## 🛠 Technologies Used

- HTML5 / CSS3
- JavaScript (Vanilla)
- LocalStorage for persistent mock data
- Google Fonts & Embedded Google Maps
- Modular JavaScript files with clear separation of UI logic (`script.js`) and app logic (`RBCP.js`)

---

## 🔐 Dummy Credentials

Use the following logins for testing:

| Role              | Username       | Password   |
|-------------------|----------------|------------|
| Owner             | `john.doe`     | `password` |
| Vet               | `vet1`         | `password` |
| Receptionist      | `reception1`   | `password` |
| Head Receptionist | `headrec`      | `password` |

These are generated when no data is found in `localStorage`.

---

## 🚀 Setup Instructions

1. **Clone or Download** the repository:
   ```bash
   git clone https://github.com/your-username/The-Pampered-Pet-veterinary-clinic-web-application.git
   cd The-Pampered-Pet-veterinary-clinic-web-application
   ```

2. **Open `index.html`** in any browser.

3. No build tools or back-end server needed — pure front-end SPA.

---


## 🧪 Developer Notes

- Role-based SPA behavior powered by vanilla JavaScript and modular logic
- All user and pet data stored in browser via `localStorage`
- Easily extendable to real backend with APIs and DB

---

## 📃 License

This project is open-source and free to use for educational or commercial purposes.
