import os
import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import pickle
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile

# ============================================================================
# CONFIGURATION & LOAD MODEL
# ============================================================================

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Paths - adapting from user's live_detection.py
MODEL_PATH = r"C:\Users\RadhaKrishna\Downloads\Sign language transcription\best_isl_model.keras"
DATA_PATH = r"C:\Users\RadhaKrishna\Downloads\Sign language transcription\processed_landmarks.pkl"
MAX_FRAMES = 60
MAX_FRAMES = 60
INCLUDE_POSE = True

# Dataset Path for serving videos
DATASET_PATH = r"C:\Users\RadhaKrishna\Downloads\Sign language transcription\Indian Sign Language Greetings Dataset - Sub Variant of INCLUDE"

@app.route('/videos/<path:filename>')
def serve_video(filename):
    from flask import send_from_directory
    return send_from_directory(DATASET_PATH, filename)

print("Loading model...")
try:
    model = tf.keras.models.load_model(MODEL_PATH)
    with open(DATA_PATH, 'rb') as f:
        data = pickle.load(f)
        class_names = data['class_names']
    print(f"✅ Model loaded: {len(class_names)} classes")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    class_names = []

# MediaPipe Setup
mp_holistic = mp.solutions.holistic

def extract_landmarks(results):
    """Extract landmarks from MediaPipe results - REUSED FROM live_detection.py"""
    # Left hand
    if results.left_hand_landmarks:
        lh = np.array([[lm.x, lm.y, lm.z] 
                      for lm in results.left_hand_landmarks.landmark]).flatten()
    else:
        lh = np.zeros(21 * 3)
    
    # Right hand
    if results.right_hand_landmarks:
        rh = np.array([[lm.x, lm.y, lm.z] 
                      for lm in results.right_hand_landmarks.landmark]).flatten()
    else:
        rh = np.zeros(21 * 3)
    
    # Pose
    if INCLUDE_POSE:
        if results.pose_landmarks:
            pose = np.array([[lm.x, lm.y, lm.z, lm.visibility] 
                           for lm in results.pose_landmarks.landmark]).flatten()
        else:
            pose = np.zeros(33 * 4)
    else:
        pose = np.zeros(0)
    
    return relative_normalize(lh, rh, pose)

def relative_normalize(lh, rh, pose):
    """Normalize landmarks - REUSED FROM live_detection.py"""
    # Reshape
    lh = lh.reshape(21, 3)
    rh = rh.reshape(21, 3)
    pose_reshaped = pose.reshape(33, 4)
    
    # Choose origin (wrist)
    if np.any(rh):
        origin = rh[0]
    elif np.any(lh):
        origin = lh[0]
    else:
        origin = np.zeros(3)
    
    # Normalize to origin
    lh = lh - origin
    rh = rh - origin
    pose_reshaped[:, :3] = pose_reshaped[:, :3] - origin
    
    # Scale by shoulder width, adding epsilon to avoid division by zero
    l_shoulder = pose_reshaped[11, :3]
    r_shoulder = pose_reshaped[12, :3]
    scale = np.linalg.norm(l_shoulder - r_shoulder) + 1e-6
    
    lh = lh / scale
    rh = rh / scale
    pose_reshaped[:, :3] = pose_reshaped[:, :3] / scale
    
    return np.concatenate([lh.flatten(), rh.flatten(), pose_reshaped.flatten()])

def process_video(video_path):
    frame_buffer = []
    cap = cv2.VideoCapture(video_path)
    
    with mp_holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as holistic:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process with MediaPipe
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = holistic.process(image)
            
            # Extract
            landmarks = extract_landmarks(results)
            frame_buffer.append(landmarks)
            
            # Optimization: Stop if we have way more frames than needed? 
            # But let's keep all to maintain temporal structure, then sample/pad.
            # Adaptation: live_detection uses a rolling deque. Here we take the whole video.

    cap.release()
    return frame_buffer

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "model_loaded": model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    if 'video' not in request.files:
        return jsonify({"error": "No video file provided"}), 400
    
    video_file = request.files['video']
    
    # Save temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix='.webm') as tmp:
        video_path = tmp.name
        video_file.save(video_path)
    
    try:
        # Process video
        frames = process_video(video_path)
        
        if not frames:
            return jsonify({
                "prediction": "No Motion",
                "confidence": 0.0,
                "message": "No frames processed"
            })

        # Check if actual landmarks were detected in the frames
        # Each frame is (1662,) float array. If all normalized to 0 or close to 0??
        # relative_normalize uses lh, rh, pose. If MediaPipe finds nothing, they are 0s.
        # But relative_normalize handles 0s.
        # Let's check non-zero count or variance.
        
        sequence = np.array(frames)
        
        # Check if meaningful content exists (heuristic)
        # If mean absolute value is very low, it might be just empty landmarks
        if np.mean(np.abs(sequence)) < 1e-4:
             return jsonify({
                "prediction": "No Hands Detected", 
                "confidence": 0.0
            })

        # Pad or Truncate to MAX_FRAMES
        if len(sequence) < MAX_FRAMES:
            padding = np.zeros((MAX_FRAMES - len(sequence), sequence.shape[1]))
            sequence = np.vstack([sequence, padding])
        else:
            # Sampling Strategy:
            # Instead of taking just the first 60, ideally we should take 60 frames evenly distributed
            # OR take the middle section if it's a long video.
            # For 3s (90 frames) -> 60 frames. 
            # Linear sampling:
            indices = np.linspace(0, len(sequence) - 1, MAX_FRAMES, dtype=int)
            sequence = sequence[indices]

        sequence = np.expand_dims(sequence, axis=0)
        
        # Predict
        probs = model.predict(sequence, verbose=0)[0]
        pred_idx = np.argmax(probs)
        confidence = float(probs[pred_idx])
        
        # Filter low confidence
        if confidence < 0.4:
            prediction = "Uncertain"
        else:
            prediction = class_names[pred_idx]
        
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "all_predictions": [
                {"sign": class_names[i], "score": float(probs[i])} 
                for i in np.argsort(probs)[-5:][::-1] # Top 5
            ]
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if os.path.exists(video_path):
            os.remove(video_path)

@app.route('/api/signs', methods=['GET'])
def get_signs():
    signs = []
    if os.path.exists(DATASET_PATH):
        for class_name in os.listdir(DATASET_PATH):
            class_dir = os.path.join(DATASET_PATH, class_name)
            if os.path.isdir(class_dir):
                # Find first video
                video_file = None
                for f in os.listdir(class_dir):
                    if f.endswith('.mp4'):
                        video_file = f
                        break
                
                if video_file:
                    signs.append({
                        "name": class_name,
                        "video_url": f"http://localhost:5000/videos/{class_name}/{video_file}"
                    })
    return jsonify(signs)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
