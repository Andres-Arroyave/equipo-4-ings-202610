# Smoke Test Critical Points - Frontend (Client)

This document details 5 critical points that must be quickly tested in the **Antojos UPB** mobile client (Expo/React Native) as part of a "Smoke Test".

## Summary Table

| Point | Flow Covered | Execution Method | Test Type |
|-------|--------------|------------------|-----------|
| 1. Application Startup | Infrastructure | Manual execution | E2E / Unit |
| 2. Navigation Login to Home | Routing & State | UI Login submission | E2E / Integration |
| 3. Vendor Display (List Render) | Client-Server Integration | Navigate to Home, view list | Integration / E2E |
| 4. Client-side Form Validations | UX & Early Validation | Trigger error on UI input | Unit / Integration |
| 5. Product Insertion UI Flow | Core Business (Write UI) | Fill and submit product form | E2E |

## Detailed Points

### 1. Application Startup
*   **Flow Covered:** Client infrastructure. Guarantees that the application can start its lifecycle and render the first screen (Login screen) without fatal dependency or syntax errors causing the app to crash.
*   **How to Execute:** By running `npx expo start` and opening the app in the simulator or Expo Go. It is verified visually (or via an automated script) that the initial screen loads cleanly without errors.
*   **Test Type:** **E2E Test** or **Unit/Component Test**.

### 2. Navigation Flow from Login to Home
*   **Flow Covered:** Routing (Navigation) and global state. Verifies that upon successful login, the router switches the navigation tree from the authentication flow to the main flow (Home/Dashboard).
*   **How to Execute:** By filling out the login form with valid credentials and pressing the "Enter" button. The test must assert that the main element of the Home screen (e.g., the text "Antojos UPB" or the search bar) becomes visible on the screen.
*   **Test Type:** **E2E Test**  or **Integration Test**.

### 3. Vendor Display (Rendering Lists)
*   **Flow Covered:** Client-Server integration and complex component rendering. Ensures that the client can parse the JSON sent by the backend and paint it on the screen without crashing.
*   **How to Execute:** Upon reaching the main screen, intercept or allow the API call and verify that the card (Card) of the first vendor in the list appears on the screen and shows data such as `NombreNegocio`.
*   **Test Type:** **Integration Test** or **E2E Test**.

### 4. Client-side Form Validations
*   **Flow Covered:** User Experience (UX) and early validation. Helps prevent useless calls to the backend by ensuring rules like "email must be valid" or "phone must have 10 digits" are applied as you type.
*   **How to Execute:** By entering an incorrect format in the email field of the Login or Register and touching another input. Verify that a red error message indicating the incorrect format appears under the input, without having pressed the submit button.
*   **Test Type:** **Unit Test** or **Integration Test**.

### 5. Product Insertion Flow from UI (Vendor)
*   **Flow Covered:** Complete write interaction from the Vendor's perspective. Verifies the handling of loading states, form submission, and success feedback.
*   **How to Execute:** While logged in as a vendor, navigate to the "Add Product" screen, fill in all required fields, press "Save" and wait for a confirmation message to appear and the UI to update.
*   **Test Type:** **E2E Test**.
