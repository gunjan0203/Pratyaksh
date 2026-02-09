
# 🛡️ Pratyaksh - India's AI-Powered Disaster Management Suite

**Pratyaksh** is a comprehensive, real-time disaster monitoring and response system specifically designed for the Indian subcontinent. By aggregating data from global satellites (NASA, USGS) and official disaster reports (ReliefWeb, GDACS), it provides a unified truth for citizens, NGOs, and government bodies.

## 🚀 Key Features

### 1. 🚨 Real-time Multi-Source Alerts

Integrated with global and national agencies to provide live updates on:

* **Earthquakes:** Live seismic data from USGS (2025-2026).
* **Floods & Landslides:** Historical and live reports from ReliefWeb and GDACS.
* **Forest Fires:** Satellite-detected thermal anomalies via NASA FIRMS.
* **Monthly Filters:** Deep-dive into historical disaster patterns at the India level.

### 2. 🛡️ Media Authentication

AI-driven engine to fight fake news during disasters.

* **Metadata Analysis:** Verifies the location and time of the uploaded media.
* **Manipulation Detection:** Uses Computer Vision to check for edited or doctored images/videos.

### 3. 🏗️ Damage Estimator & Needs Analysis

Bridging the gap between destruction and relief.

* **Damage Estimation:** AI models to categorize property damage as Low, Medium, or High.
* **Damage-to-Needs:** A logic-driven engine that predicts required resources (Food, Medicine, Shelters) based on the type of disaster and location.

---

## 🛠️ Tech Stack

* **Backend:** Python (FastAPI) - Chosen for its superior AI/ML ecosystem and processing speed.
* **Data Sources:** * **GOOGLE EARTH ENGINE API:** For live fire satellite telemetry.
* **USGS FDSN:** For real-time seismic event tracking.
* **ReliefWeb (UN-OCHA):** For historical disaster reports (2025-26).
* **GDACS:** For global flood and cyclone coordination.


* **AI/CV Libraries:** OpenCV, Pillow, Python-Dotenv (for secure API management).

---

## 📦 Installation & Setup

1. **Clone the repository:**
```bash
git clone https://github.com/gunjan0203/Pratyaksh.git
cd natural disaster/backend

```


2. **Create a Virtual Environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

```


3. **Install Dependencies:**
```bash
pip install -r requirements.txt

```


4. **Environment Variables:**
Create a `.env` file in the root directory and add your keys:
```env
GOOGLE_EARTH_ENGINE=your_free_gee_key_here

```


5. **Run the Server:**
```bash
uvicorn app.main:app --reload

```



---

## 💼 Business Model (Hackathon Special)

| Model          | Target Audience     | Feature                                 |
| ---            | ---                 | ---                                     |
| **Freemium**   | General Public      | Live Map & SOS Alerts                   |
| **B2B (SaaS)** | Logistics/Insurance | Damage Estimation & Route Optimization  |
| **B2G**        | Governments/NGOs    | Damage-to-Needs Portal & Command Center |

---

## 🤖 Why Python?

We opted for **Python** due to its robust ecosystem for **AI and Data Wrangling**. Using libraries like `FastAPI` ensures our response time is low-latency, while `requests` and `csv` allow us to seamlessly parse satellite telemetry from NASA and USGS.

---

### 💡 Contributors

"Gunjan Arora" - Backend Lead & AI Logic
"Drishty Hasija" - for Frontend and UI
"Manya Kaur Chopra" - for Frontend and UI
---