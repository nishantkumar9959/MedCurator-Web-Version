# MedCurator Web Edition
### *A Reactive Enterprise-Grade Clinical Operations Dashboard and LLM-Driven Administrative Analytics Platform*

---

## Abstract / Executive Summary
Modern clinical environments are chronically plagued by operational bottlenecks due to fragmented administrative pipelines across registration, inventory, scheduling, and invoicing. **MedCurator Web Edition** resolves this systemic integration gap by presenting a unified, low-latency, and reactive administrative terminal. Built using a high-performance **React 19** frontend, structured dynamically through **Tailwind CSS v4**, and animated with hardware-accelerated transitions via **Motion v12**, the client synchronizes state in real time with a cloud-based **Firebase Firestore** backend-as-a-service. It establishes a multi-channel clinical telemetry dashboard via **Recharts** and automates client-side report compilation using `html-to-image` and `jsPDF`. Security and compliance boundaries are enforced through a server-side declarative **Firestore Security Rules** engine, restricting data access strictly on user-level scopes. Furthermore, a sandboxed administrative conversational interface leverages the **Google GenAI SDK** (running `gemini-3-flash-preview`) to query clinical metrics under strict cognitive restrictions that prohibit medical diagnosis. MedCurator demonstrates how modern reactive frameworks can be merged with cloud databases to maximize hospital administrative throughput while ensuring patient data isolation.

---

## Core System Capabilities
- **Reactive Telemetry & Bidirectional State Synchronization**: Leverages real-time Firebase listeners (`onSnapshot` and `onAuthStateChanged`) to update patient metrics, scheduling changes, and doctor configurations across active client nodes without page reloads.
- **Fine-Grained Role-Based Access Validation**: Secures administrative boundaries by validating user identity tokens server-side. Writes to private scopes are filtered by regex matchers (e.g., email format checks, image URL validation) before commitment to the database.
- **Tri-State Pharmacy Inventory Management**: Classifies clinical medications dynamically using mathematical stock boundaries: **In Stock** ($S > 20$), **Low Stock** ($0 < S \leq 20$), and **Out of Stock** ($S = 0$), initiating visual warnings and restocking processes.
- **Invoicing & Double-Entry Ledger Tracking**: Manages ledger logic dynamically by calculating invoice line items, logging payment methods (UPI, Cash, Credit Card), tracking outstanding debts, and formatting currency under `en-IN` standards.
- **Client-Side PDF Document Compilation Pipeline**: Employs DOM canvas serialization to export active operational summaries, charts, and metrics directly into high-fidelity PDF documents, bypassing server-side rendering latency and layout shifting.
- **Context-Bound LLM Operational Operator**: Embeds a terminal administrative assistant configured with system instructions restricting context to clinical operations (billing status, pharmacy volumes, schedules) while raising safety blocks for clinical diagnoses.

---

## Architectural Design & Data Flow
The architecture of **MedCurator Web Edition** separates client layout components, client state controls, validation barriers, database nodes, and cognitive processing environments:

```
[ User UI Viewport (React 19 + Tailwind CSS v4 + Motion v12) ]
                                |
             +------------------+------------------+
             |                                     |
             v                                     v
[ State & Telemetry Managers ]             [ View Component Modules ]
(useState / useEffect / useMemo)      (AppointmentsView, BillingView, etc.)
             |                                     |
             v                                     +---------+
[ Firestore Snapshot Listeners ]                             |
(onSnapshot / onAuthStateChanged)                            v
             |                                   [ Document Generators ]
             v                                   (jsPDF & html-to-image)
[ Firebase Client SDK Pipeline ]                             |
             |                                               v
             +------------------+                    [ Local PDF Export ]
                                |
                     [ Firestore Security Rules ] (UID ownership & regex schema validation)
                                |
                                v
                   [ Cloud Firestore Database ]
                                |
                     [ Collection Schema: ]
                 /users  |  /patients  |  /billing
                                |
                                v
                 [ External Service Dispatcher ]
                                |
                  +-------------+-------------+
                  |                           |
                  v                           v
         [ Firebase Auth ]            [ Google GenAI SDK ]
      (User Identity Tokens)      (gemini-3-flash-preview API)
```

### Data Pipeline Mechanics
1. **Authentication Interception**: The system registers identity status via `onAuthStateChanged` in [App.tsx](src/App.tsx). Unauthenticated requests are immediately routed to the [LoginView.tsx](src/components/auth/LoginView.tsx) layout boundary.
2. **Read/Write Operations**: User actions (such as patient registration in [RegistrationView.tsx](src/components/RegistrationView.tsx)) compile form inputs and dispatch a collection write query via `addDoc` to the Firestore client SDK.
3. **Declarative Validation Barrier**: Firestore interceptors evaluate the incoming write payload against rules configured in [firestore.rules](firestore.rules). The engine asserts that the client UID matches the document path ID and executes `isValidUser()` to verify types and lengths.
4. **Reactive Telemetry Broadcast**: Active listeners in [DashboardView.tsx](src/components/DashboardView.tsx) catch change flags from the database, compiling data updates dynamically and pushing them directly into the Recharts layout engine.
5. **AI Assistant Dispatch**: Conversation queries are intercepted by the client-side helper in [AIAssistant.tsx](src/components/AIAssistant.tsx), checked for environment keys, and processed via the `@google/genai` API with strict containment prompts.

---

## Tech Stack & Architectural Justifications

| Technology | Architectural Boundary | Engineering Justification |
| :--- | :--- | :--- |
| **React 19** | User Interface Engine | Provides a declarative component paradigm with optimized virtual DOM diffing to handle rapid telemetry updates from the database without lagging. |
| **TypeScript (~v5.8)** | Static Type Safety | Eliminates runtime exceptions by enforcing static checks on structures like `Medication`, `Invoice`, `Appointment`, and `FirestoreErrorInfo`. |
| **Vite (v6)** | Build & Development Tooling | Provides sub-millisecond Hot Module Replacement (HMR) and highly optimized compilation via Rollup, improving cold-start parameters. |
| **Tailwind CSS v4** | UI Utility Framework | Maximizes layout responsiveness and styling efficiency with an optimized compile-time engine, minimizing raw CSS delivery payloads. |
| **Motion v12** | Micro-Animations & Transitions | Powers layout shifts and modal states (`AnimatePresence` & spring transitions) without manual DOM manipulation, utilizing hardware acceleration. |
| **Cloud Firestore** | NoSQL Data Store | Delivers low-latency document storage with automated synchronization using WebSockets, reducing REST polling requirements. |
| **Firebase Auth** | Identity Access & Management | Secures credentials and brokers JSON Web Tokens (JWT), which are verified on Firestore server nodes to prevent spoofing. |
| **Google GenAI SDK** | Machine Learning Interface | Connects to `gemini-3-flash-preview` to perform natural language processing over operational variables with low response latency. |
| **Recharts (v3.8)** | Telemetry & Data Visualization | Generates responsive SVG charts that adapt to state mutations, providing clear, real-time analytics. |
| **jsPDF & html-to-image** | Client-Side Document Generator | Captures high-resolution DOM configurations and compiles them to PDF without requiring backend server resources. |

---

## Mathematical / Logical Framework

### 1. Financial Ledger Aggregation
The grand total of any patient invoice compiled in [BillingView.tsx](src/components/BillingView.tsx) is calculated dynamically using a standard linear combination of product quantities and unit prices:

$$\text{TotalInvoiceAmount} = \sum_{i=1}^{N} \left( q_i \times p_i \right)$$

Where:
- $N \in \mathbb{N}^+$ represents the total number of line items inside the invoice.
- $q_i \in \mathbb{N}^+$ is the quantity of the item at index $i$.
- $p_i \in \mathbb{R}^+_{0}$ represents the unit price of the item at index $i$ in Indian Rupees ($\text{INR}$).

### 2. Pharmacy Stock Level Classification Function
To determine whether an item requires urgent replenishment, [PharmacyView.tsx](src/components/PharmacyView.tsx) maps the stock level $S \in \mathbb{N}_0$ to a tri-state badge using the following piecewise constraint function:

$$f(S) = \begin{cases} 
\text{"IN STOCK"}, & \text{if } S > 20 \\ 
\text{"LOW STOCK"}, & \text{if } 0 < S \leq 20 \\ 
\text{"OUT OF STOCK"}, & \text{if } S = 0 
\end{cases}$$

### 3. Firestore Declarative Write Authorization Check
Writes to `/users/{userId}` in [firestore.rules](firestore.rules) are authenticated and schema-validated according to the following boolean assertion:

$$P_{\text{write}}(U_{\text{uid}}, R) = \text{isAuthenticated}() \wedge \left( U_{\text{uid}} = \text{request.auth.uid} \right) \wedge \text{isValidUser}(R_{\text{data}})$$

Where:
- $U_{\text{uid}}$ is the user's document ID.
- $R_{\text{data}}$ represents the incoming resource data payload.
- $\text{isValidUser}(R_{\text{data}})$ ensures that the payload contains required string types, that the email matches basic regex limits, and that optional fields (like phone numbers) fit designated string length constraints.

### 4. AI Sandboxed Query Execution Function
The conversational response $R_{\text{assistant}}$ in [AIAssistant.tsx](src/components/AIAssistant.tsx) is a function of the user query $Q$ filtered by the administrative system instruction set $I_{\text{sys}}$:

$$R_{\text{assistant}} = \text{LLM}\left( Q \mid I_{\text{sys}} \right)$$

The system instructions act as a cognitive filter:

$$I_{\text{sys}} \implies \text{Operations} \wedge \text{Billing} \wedge \text{Pharmacy} \wedge \neg \text{Medical Diagnosis}$$

---

## Production Deployment & Installation Pipeline

### System Prerequisites
- **Node.js**: version `18.x` or higher.
- **npm**: version `9.x` or higher.
- **Firebase Account**: project configured with Firestore database and email authentication.
- **Google AI Studio Key**: API key matching the Google GenAI configuration.

### Environment Configuration
Create a `.env.local` configuration file in the project's root folder:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_FIREBASE_DATABASE_ID=(default)
GEMINI_API_KEY=your_gemini_api_key
```

> [!IMPORTANT]
> To prevent environment variable leakage to the client, the `GEMINI_API_KEY` must not be prefixed with `VITE_` unless explicitly required by your deployment pipelines. It is isolated from client-side runtime exports by Vite and loaded only inside [AIAssistant.tsx](src/components/AIAssistant.tsx)'s integration module.

### Step-by-Step Installation
1. **Navigate to the workspace and install packages**:
   ```bash
   cd MedCurator-Web-Version
   npm install
   ```
2. **Validate the TypeScript build configurations**:
   ```bash
   npm run lint
   ```
3. **Execute local development instance**:
   ```bash
   npm run dev
   ```
   > The application launches a local server visible at `http://localhost:3000`.

4. **Deploy Firestore Security Rules**:
   To push rules defined in [firestore.rules](firestore.rules) to your Firebase project:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use your_project_id
   firebase deploy --only firestore:rules
   ```

---

## Implementation & Interface Examples

### 1. Patient Ingestion Payload Example
A typical JSON payload constructed during patient registration in [RegistrationView.tsx](src/components/RegistrationView.tsx) matches the following layout:
```json
{
  "firstName": "Rajesh",
  "lastName": "Kumar",
  "dob": "1988-11-23",
  "gender": "Male",
  "address": "123 Healthcare Avenue, Medical District, New Delhi, 110001",
  "phone": "+91 98765 43210",
  "email": "rajesh.kumar@healthcare.org",
  "bloodGroup": "O+",
  "weight": "78",
  "chiefComplaint": "Routine cardiovascular checkup; tracking blood pressure fluctuations.",
  "registrationDate": "2026-05-27T10:30:00.000Z",
  "status": "Active"
}
```

### 2. Invoice Document Structure Example
When compiling invoices inside [BillingView.tsx](src/components/BillingView.tsx), the state array utilizes items matching this schema:
```json
{
  "id": "INV-2026-006",
  "patientName": "Rajesh Kumar",
  "date": "2026-05-27",
  "status": "Pending",
  "paymentMethod": "-",
  "lineItems": [
    {
      "description": "Cardiovascular Specialist Consultation",
      "quantity": 1,
      "price": 800
    },
    {
      "description": "Electrocardiogram (ECG)",
      "quantity": 1,
      "price": 1500
    }
  ]
}
```

### 3. Firestore Security Rules Exception Serialization
In the event of an unauthenticated or invalid write, the error handling pipeline in [firebase.ts](src/firebase.ts) intercepts the request error, parsing it into a structured diagnostics payload:
```json
{
  "error": "FirebaseError: [code=permission-denied]: Missing or insufficient permissions.",
  "operationType": "create",
  "path": "patients",
  "authInfo": {
    "userId": "usr_9J1cZ8b",
    "email": "doctor@medcurator.com",
    "emailVerified": true,
    "isAnonymous": false,
    "tenantId": null,
    "providerInfo": [
      {
        "providerId": "password",
        "displayName": "Dr. Rajesh Kumar",
        "email": "doctor@medcurator.com",
        "photoUrl": null
      }
    ]
  }
}
```
