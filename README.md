# ✋SignAI — Indian Sign Language Transcription System  
### **Team: Byte_Coders**

**Team Lead:**  
- **Shinjan Saha**

**Members:**  
- **Satyabrata Das Adhikari**  
- **Sayan Sk**

SignAI is an AI-powered **Indian Sign Language (ISL) transcription system** that translates sign language gestures into readable (and optionally audible) text using **MediaPipe landmarks and deep learning**.  
The system supports **live webcam detection** as well as **video-based inference**.

---

# 📌 1. Project Overview

This repository contains the **complete pipeline** for training, evaluating, and deploying a landmark-based ISL recognition model.

Unlike raw image-based approaches, SignAI uses **structured hand and pose landmarks**, making it robust to:

- Background clutter  
- Lighting variations  
- Camera quality differences  
- Limited dataset size  

The model outputs:
- Predicted ISL sign  
- Confidence score  
- Top-k class probabilities  

---

# ⚙️ 2. Environment Setup

### **Recommended Python Version**
**Python 3.10**

> ⚠️ MediaPipe is unstable on Python 3.12

### **Install Dependencies**
```bash
pip install -r requirements.txt
Typical requirements include:

tensorflow
mediapipe
opencv-python
numpy
flask
flask-cors
scikit-learn
tqdm
```

# 🔁 3. How to Reproduce Final Results
```
Step 1 — Dataset Setup
Place the dataset in the project root directory.

Expected structure:

Indian Sign Language Greetings Dataset - Sub Variant of INCLUDE/
├── Alright/
├── Good Morning/
├── Good afternoon/
├── Good evening/
├── Good night/
├── Hello/
├── How are you/
├── Pleased/
└── Thank you/
Each class folder contains multiple .mp4 videos.


Step 2 — Landmark Extraction & Processing
Landmarks are extracted using MediaPipe Holistic:

Left hand landmarks
Right hand landmarks
Pose landmarks (face excluded)
Each video is converted into a fixed-length sequence:
60 frames
258 features per frame
Processed landmarks and metadata are stored in:

processed_landmarks.pkl


Step 3 — Train the Model
Training is performed using a Bidirectional LSTM (BiLSTM) architecture.

Configuration:
Input shape: (60, 258)
Optimizer: Adam
Loss: Categorical Crossentropy
Epochs: 100
Batch size: 16

Training notebook:

ISL_transcription.ipynb
The best-performing model is saved as:

best_isl_model.keras


Step 4 — Training Results & Evaluation
After training, the following artifacts are generated:

📊 Evaluation Outputs
confusion_matrix.png
training_history.png

Metrics include:
Accuracy
Precision
Recall
F1-score
Confusion matrix

Step 5 — Run Live Detection
Real-time inference using webcam input.

Run:
python live_detection.py
Controls:

SPACE → Start / Stop recording gesture
Q → Quit application

The script:
Collects landmark sequences
Runs model inference
Displays predicted sign with confidence
Optionally supports text-to-speech output
```

# 🚀 4. Backend & Web Integration
```
The project includes a Flask backend and a React (Vite) frontend.

Backend (/backend)
Loads trained .keras model
Accepts video or frame input
Returns prediction summaries as JSON

Run backend:

cd backend
python app.py
Frontend (/frontend)
Built with React + Vite
Communicates with backend using Axios
Displays predictions and confidence scores

Run frontend:

cd frontend
npm install
npm run dev
```

# 📁 5. Project Structure

```
Sign language transcription/
├── backend/
│   ├── app.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Indian Sign Language Greetings Dataset - Sub Variant of INCLUDE/
│
├── isl_env/
│
├── best_isl_model.keras
├── processed_landmarks.pkl
├── live_detection.py
├── ISL_transcription.ipynb
├── confusion_matrix.png
├── training_history.png
├── requirements.txt
└── README.md
```

# 📤 6. Expected Outputs & Interpretation

```
During inference, the system produces:
✔️ Predicted ISL sign
✔️ Confidence score
✔️ Top-k predictions
✔️ Optional text-to-speech output

During training:
Accuracy and loss curves
Confusion matrix
Class-wise performance metrics
These outputs help analyze:
Model generalization
Class-level confusion
Training convergence
```

# 📬 Interested in a Similar Project?

I build smart, ML-integrated applications and responsive web platforms. Let’s build something powerful together!

📧 shinjansaha00@gmail.com

🔗 [LinkedIn Profile](https://www.linkedin.com/in/shinjan-saha-1bb744319/)
