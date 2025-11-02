#  Firebase Authentication with React Native / Flutter
 **Aim**
To build a **Login** and **Sign Up** form in a mobile app using **Firebase Authentication** with **Email/Password** as a mandatory method, and optionally **Google Sign-In** and **Phone OTP** authentication.  
The app must **persist session states** and show a **protected Home/Dashboard** screen only after successful login.

---

##  **Outcomes**
By the end of this experiment, students will be able to:
- Configure a **Firebase project** and enable authentication providers.  
- Implement **Sign-In**, **Sign-Up**, **Sign-Out**, and **Password Reset** flows.  
- Guard app routes/screens for **authenticated vs guest users**.  
- Log and handle common authentication errors (e.g. invalid email, weak password, user not found).  
- Optionally add **Google Sign-In** or **Phone OTP** authentication.  
- Link multiple providers (e.g. Google + Email) to the same Firebase account.

---

##  **What is Firebase Authentication?**

Firebase Authentication is a **managed identity service** with SDKs for **mobile and web**.  
It supports multiple sign-in methods such as:
- **Email/Password**
- **Google**
- **Apple**
- **Phone Number**
- **Custom Providers**

It integrates with other Firebase services and follows the **OpenID Connect** standard.

---

##  **Integration Styles**
1. **SDK-Based Integration** — using the Firebase Auth SDK directly.  
2. **FirebaseUI** — using pre-built UI components.

---

##  **Auth State Model**

Firebase Auth exposes an **observer** that notifies when the current user changes (login/logout).  
The app must:
- Listen to the auth state changes.
- Render `AuthStack` (Login/Signup screens) for unauthenticated users.
- Render `AppStack` (Home/Dashboard screens) for authenticated users.

---

##  **Security Guidelines**
- Never store **plain-text passwords** locally.
- Always use **TLS** for network communication.
- Enable **App Check** and **Play Integrity** to protect backend resources.
- Implement **rate limiting** for SMS verification and enable **reCAPTCHA** defenses.

---