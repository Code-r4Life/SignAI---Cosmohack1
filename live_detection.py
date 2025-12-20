import cv2
import numpy as np
import mediapipe as mp
import tensorflow as tf
import pickle
from collections import deque

# ============================================================================
# CONFIGURATION
# ============================================================================

MODEL_PATH = r"C:\Users\RadhaKrishna\Downloads\Sign language transcription\best_isl_model.keras"
DATA_PATH = r"C:\Users\RadhaKrishna\Downloads\Sign language transcription\processed_landmarks.pkl"
MAX_FRAMES = 60
INCLUDE_POSE = True
# INCLUDE_FACE = False

# ============================================================================
# LOAD MODEL & CLASS NAMES
# ============================================================================

print("Loading model...")
model = tf.keras.models.load_model(MODEL_PATH)

with open(DATA_PATH, 'rb') as f:
    data = pickle.load(f)
    class_names = data['class_names']

print(f"✅ Model loaded: {len(class_names)} classes")
print(f"   Classes: {class_names}")

# ============================================================================
# MEDIAPIPE SETUP
# ============================================================================

mp_holistic = mp.solutions.holistic
mp_drawing = mp.solutions.drawing_utils

def extract_landmarks(results):
    """Extract landmarks from MediaPipe results"""
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
    
    # # Face (if enabled)
    # if INCLUDE_FACE:
    #     if results.face_landmarks:
    #         face = np.array([[lm.x, lm.y, lm.z] 
    #                        for lm in results.face_landmarks.landmark]).flatten()
    #     else:
    #         face = np.zeros(468 * 3)
    # else:
    #     face = np.zeros(0)
    
    return relative_normalize(lh, rh, pose)

def relative_normalize(lh, rh, pose):
    """Normalize landmarks (if you used this in training)"""
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
    
    # Scale by shoulder width
    l_shoulder = pose_reshaped[11, :3]
    r_shoulder = pose_reshaped[12, :3]
    scale = np.linalg.norm(l_shoulder - r_shoulder) + 1e-6
    
    lh = lh / scale
    rh = rh / scale
    pose_reshaped[:, :3] = pose_reshaped[:, :3] / scale
    
    return np.concatenate([lh.flatten(), rh.flatten(), pose_reshaped.flatten()])

# ============================================================================
# LIVE DETECTION
# ============================================================================

def live_detection():
    """Real-time sign language detection from webcam"""
    
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened():
        print("❌ Cannot open webcam!")
        return
    
    # Set resolution
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
    # Frame buffer
    frame_buffer = deque(maxlen=MAX_FRAMES)
    
    # Prediction state
    is_recording = False
    current_prediction = "Press SPACE to start"
    confidence = 0.0
    
    print("\n" + "="*60)
    print("🎥 LIVE SIGN LANGUAGE DETECTION")
    print("="*60)
    print("Controls:")
    print("  SPACE - Start/Stop recording gesture")
    print("  Q     - Quit")
    print("="*60 + "\n")
    
    with mp_holistic.Holistic(
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    ) as holistic:
        
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Flip for mirror effect
            frame = cv2.flip(frame, 1)
            
            # Process with MediaPipe
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = holistic.process(image)
            image.flags.writeable = True
            image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
            
            # Draw landmarks
            if results.pose_landmarks:
                mp_drawing.draw_landmarks(
                    image, results.pose_landmarks, mp_holistic.POSE_CONNECTIONS)
            if results.left_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image, results.left_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
            if results.right_hand_landmarks:
                mp_drawing.draw_landmarks(
                    image, results.right_hand_landmarks, mp_holistic.HAND_CONNECTIONS)
            
            # Record frames when active
            if is_recording:
                landmarks = extract_landmarks(results)
                
                # Apply normalization if used in training
                # landmarks = relative_normalize(
                #     landmarks[:63], landmarks[63:126], landmarks[126:]
                # )
                
                frame_buffer.append(landmarks)
                
                # Show recording indicator
                cv2.circle(image, (30, 30), 15, (0, 0, 255), -1)
                cv2.putText(image, "RECORDING", (60, 40), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Display prediction
            cv2.putText(image, f"Prediction: {current_prediction}", (10, 80),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.putText(image, f"Confidence: {confidence:.2%}", (10, 120),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.putText(image, f"Frames: {len(frame_buffer)}/{MAX_FRAMES}", (10, 160),
                       cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 0), 2)
            
            # Show frame
            cv2.imshow('ISL Live Detection', image)
            
            # Keyboard controls
            key = cv2.waitKey(1) & 0xFF
            
            if key == ord(' '):  # SPACE - toggle recording
                if not is_recording:
                    # Start recording
                    is_recording = True
                    frame_buffer.clear()
                    current_prediction = "Recording..."
                    print("🔴 Recording started")
                else:
                    # Stop and predict
                    is_recording = False
                    print(f"⏹️  Recording stopped ({len(frame_buffer)} frames)")
                    
                    if len(frame_buffer) >= 10:  # Minimum frames
                        # Prepare sequence
                        sequence = np.array(list(frame_buffer))
                        
                        # Pad if needed
                        if len(sequence) < MAX_FRAMES:
                            padding = np.zeros((MAX_FRAMES - len(sequence), sequence.shape[1]))
                            sequence = np.vstack([sequence, padding])
                        else:
                            sequence = sequence[:MAX_FRAMES]
                        
                        # Predict
                        sequence = np.expand_dims(sequence, axis=0)
                        probs = model.predict(sequence, verbose=0)[0]
                        pred_idx = np.argmax(probs)
                        
                        current_prediction = class_names[pred_idx]
                        confidence = probs[pred_idx]
                        
                        print(f"✅ Prediction: {current_prediction} ({confidence:.2%})")
                        
                        # Show top 3
                        top3 = np.argsort(probs)[-3:][::-1]
                        print("   Top 3:")
                        for i, idx in enumerate(top3, 1):
                            print(f"      {i}. {class_names[idx]}: {probs[idx]:.2%}")
                    else:
                        current_prediction = "Too few frames"
                        print("⚠️  Too few frames captured")
            
            elif key == ord('q'):  # Q - quit
                break
    
    cap.release()
    cv2.destroyAllWindows()
    print("\n👋 Exited")

if __name__ == "__main__":
    live_detection()