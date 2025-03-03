import os
import numpy as np
import cv2
import matplotlib.pyplot as plt
from lime import lime_image
from skimage.segmentation import mark_boundaries
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

# Set Image Directory
image_dir = r"C:\Users\kravm\Pictures\DALLE_Local"
image_extensions = (".jpg", ".jpeg", ".png", ".webp")

# Function to Load Images Safely
def load_images_from_directory(directory):
    images = []
    labels = []
    filenames = []

    print(f"Checking directory: {directory}")  # Debugging

    for i, filename in enumerate(os.listdir(directory)):
        if filename.lower().endswith(image_extensions):  # Check for valid images
            img_path = os.path.join(directory, filename)
            print(f"Attempting to load: {img_path}")  # Debugging

            # Use IMREAD_UNCHANGED for better `.webp` support
            img = cv2.imread(img_path, cv2.IMREAD_UNCHANGED)

            if img is None:
                print(f"Error loading {img_path}, skipping...")
                continue  # Skip bad images

            # Convert grayscale `.webp` images to 3-channel format
            if len(img.shape) == 2:
                img = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
            elif img.shape[2] == 4:  # Convert from RGBA to RGB
                img = cv2.cvtColor(img, cv2.COLOR_BGRA2BGR)

            img = cv2.resize(img, (32, 32))
            images.append(img)
            labels.append(i)
            filenames.append(filename)

    if len(images) == 0:
        print("🚨 No valid images found! Check file paths or permissions.")

    return np.array(images), np.array(labels), filenames
