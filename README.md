# 🚀 SENTRA AI 2.0 — Futuristic Autonomous Voice Command Center 🤖✨

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?color=00F7FF&size=28&center=true&vCenter=true&width=750&lines=SENTRA+AI+2.0+Online;Autonomous+Voice-First+Command+Center;Holographic+3D+AI+Orb+%2B+Neural+Audio;Multi-Language+Code+%2B+DSA+%2B+Game+Engine;Engineered+by+Anant+Malik+🔥" />
</p>

---

## 🌌 Overview

**SENTRA AI 2.0** is a production-grade, voice-first desktop AI assistant engineered as a futuristic holographic AI command center. Unlike traditional chatbots or static dashboards, Sentra 2.0 combines real-time WebGL 3D holographic rendering, audio waveform telemetry, multi-language autonomous code generation, system automation, and hybrid cloud/offline intelligence.

```
                    SENTRA AI 2.0
                         │
              ┌──────────┴──────────┐
              │                     │
        React 19 Frontend      Python 3.11 Backend
       (Vite + Three.js)         (Flask REST API)
              │                     │
       Holographic 3D Orb        AI Brain
      Audio Visualizer (HUD)   (Mistral / Heuristic)
              │                     │
              └──────────┬──────────┘
                         │
                     Router
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     Browser          Code             System
     Actions         Engine           Actions
        │                │                │
     Search           DSA            Apps/Files
     YouTube          Python, C++     Workstation Lock
     Web Auto         Java, JS, etc.  Volume/Mute
```

---

## ⚡ Key Highlights & Features

### 1. 🔮 Central 3D Holographic AI Orb
- Engineered with **Three.js** & WebGL.
- Features multi-layered gyroscopic rings, core breathing glow, quantum particle nebula, and responsive visual states:
  - `IDLE` (Deep cyan slow pulse)
  - `LISTENING` (Emerald green expansion reactive to mic amplitude)
  - `PROCESSING` (Amber rotation layer)
  - `THINKING` (Hyper-speed magenta/purple neural drift)
  - `EXECUTING` (Electric cyan high-energy pulse)
  - `SPEAKING` (Audio-synchronized oscillation)
  - `ERROR` (Crimson alert)
  - `OFFLINE` (Stealth slate standby)

### 2. 🎤 Voice-First Intelligence Pipeline
- Built-in speech recognition (`SpeechRecognition`) with dynamic ambient noise cancellation.
- Thread-safe, non-blocking text-to-speech output (`pyttsx3`).
- Audio visualization canvas reacting dynamically to microphone amplitude.

### 3. 💻 Multi-Language Autonomous Code Engine
- Intelligently parses spoken directives in English and Hinglish (`"Python mein binary search likho"`, `"C++ mein linked list banao"`).
- Supported languages: **Python, C, C++, Java, JavaScript, TypeScript, HTML, CSS, SQL**.
- DSA Engine: Arrays, Trees, BSTs, Linked Lists, Heaps, Stacks, Queues, Graphs, Dynamic Programming.
- Game Engine: Terminal & 2D games (Snake, Pong, Tic Tac Toe, Flappy Bird).
- Automatically writes sanitized source files without markdown fences, opens them directly in **VS Code**, executes safe scripts, and returns execution logs to the UI.

### 4. 🧠 Hybrid Online / Offline Architecture
- **Online Mode**: High-reasoning structured JSON parsing and generation with **Mistral AI**.
- **Offline / Hybrid Mode**: Zero-downtime offline rule analyzer, local system actions, native app launch, memory recall, and offline code templates.

### 5. 🛡️ Enterprise Security
- Complete removal of hardcoded API keys. All credentials configured via `.env` (Mistral key, Gmail SMTP credentials).
- Strictly sandboxed frontend with no exposed secret keys.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Three.js, Lucide Icons, Canvas API |
| **Backend** | Python 3.11, Flask, Flask-CORS, python-dotenv |
| **Voice & Speech** | SpeechRecognition, pyttsx3, PyAudio |
| **Intelligence** | Mistral AI SDK (v2.4.2), Offline Heuristic Rule Analyzer |
| **Automation** | PyAutoGUI, Selenium, WebBrowser, Subprocess |
| **Telemetry** | psutil, REST API |

---

## 🚀 Installation & Setup

### 1. Clone & Configure Environment

```bash
git clone https://github.com/your-username/sentra-ai.git
cd sentra-ai
```

Copy the environment template and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env`:
```env
MISTRAL_API_KEY=your_mistral_api_key_here
MISTRAL_MODEL=mistral-small-latest
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password_here
SENTRA_HOST=0.0.0.0
SENTRA_PORT=5000
SENTRA_MODE=hybrid
```

### 2. Backend Setup

Install Python dependencies:

```bash
pip install -r requirements.txt
```

Launch the Sentra Flask Server:

```bash
python server.py
```
> Server runs on `http://localhost:5000`

### 3. Frontend Setup

Navigate into the UI directory:

```bash
cd sentra-ui
npm install
npm run dev
```
> Vite frontend launches on `http://localhost:5173`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Live status of AI brain, voice STT, TTS, memory, and backend |
| `GET` | `/system/status` | Real-time CPU, RAM, telemetry, and memory count |
| `POST` | `/command` | Ingests natural language command and dispatches action |
| `POST` | `/voice/listen` | Triggers host microphone capture and speech recognition |
| `POST` | `/voice/speak` | Server-side text-to-speech output |
| `GET` | `/history` | Retrieves recent command execution history |
| `DELETE` | `/history` | Clears all logged executions |

---

## 🗣️ Supported Commands

- **Voice Trigger**: Tap the large central HUD microphone or speak.
- **App Control**: `"Open YouTube"`, `"Open Chrome"`, `"Open VS Code"`, `"Open Calculator"`, `"Open Notepad"`
- **Music & Media**: `"Play Kesariya on YouTube"`, `"Play synthwave music"`
- **Time**: `"What time is it?"`, `"Tell me the time"`
- **Code Generation**:
  - `"Write a binary search tree in Python"`
  - `"Create a linked list in C++"`
  - `"Implement a stack in Java"`
  - `"Write a calculator in JavaScript"`
- **Game Engine**:
  - `"Create a Snake game in Python"`
  - `"Create a Pong game"`
- **System Actions**:
  - `"Volume up"`, `"Volume down"`, `"Mute"`, `"Lock workstation"`
- **Memory**:
  - `"Remember that my meeting is at 4 PM"`
  - `"What do you remember?"`

---

## 👑 Author

**Anant Malik**  
AI Developer | Systems Architect
