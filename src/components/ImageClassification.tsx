import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";

// Check if a backend is registered
const backend = tf.getBackend();
if (backend != null) {
  console.log(`Backend "${backend}" is registered.`);
} else {
  console.log("No backend is registered.");
}

const mobilenet = require("@tensorflow-models/mobilenet");

interface HeaderProps {
  title: string;
}
const ImageClassification: React.FC<HeaderProps> = ({ title }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPrediction(null); // Reset prediction when a new image is selected
    }
  };

  const handleImageUpload = async () => {
    const img = document.getElementById("img");
    // Load the model.
    const model = await mobilenet.load();
    console.log(img);

    // Classify the image.
    const predictions = await model.classify(img);

    console.log(predictions);
    Object.keys(predictions).forEach((k) => {
      console.log(k, predictions[k]); // ERROR!!
    });
  };

  return (
    <div className="student-form">
      <label htmlFor="file-upload" className="custom-file-upload">
        Upload
      </label>
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button onClick={handleImageUpload}>Upload & Predict</button>
      {selectedImage && (
        <div>
          <h2>Selected Image:</h2>
          <img
            id="img"
            src={URL.createObjectURL(selectedImage)}
            alt="Selected"
          />
        </div>
      )}
      {prediction && (
        <div>
          <h2>Prediction:</h2>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
};

export default ImageClassification;
