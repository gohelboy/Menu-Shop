"use client";
import React, { useState } from "react";
import Image from "next/image";
import Tesseract from "tesseract.js";

export default function DashboardPage() {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);

      // Extract text using Tesseract.js OCR
      setLoading(true);
      Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m), // Optionally log the OCR process
      }).then(({ data: { text } }) => {
        setExtractedText(text);
        setLoading(false);
      });
    }
  };

  // Function to generate image using Hugging Face API (Stable Diffusion)
  const generateImageFromText = async (prompt) => {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer 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`, // Use your actual Hugging Face API key here
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );
    const data = await response.json();
    if (data && data[0]) {
      setGeneratedImage(data[0].generated_image_url); // Get the generated image URL
    } else {
      console.error("Error generating image", data);
    }
  };

  return (
    <div className="h-full grid grid-cols-2 items-center justify-center gap-4">
      {/* Image Upload Section */}
      <div className="flex items-center justify-center border h-full hover:bg-slate-100">
        <input
          type="file"
          onChange={handleImageChange}
          className="hidden"
          id="file-upload"
          accept="image/*"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer text-xl text-gray-700 font-semibold"
        >
          Choose Image
        </label>
      </div>

      {/* Image Preview Section */}
      <div className="flex items-center justify-center border h-full overflow-hidden">
        {image ? (
          <div className="w-full h-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={image}
              alt="Preview"
              width={500}
              height={500}
              className="rounded-lg w-full h-full object-cover"
            />
          </div>
        ) : (
          <p className="text-lg text-gray-500">No image selected</p>
        )}
      </div>

      {/* Extracted Text */}
      <div className="w-full flex justify-center items-center p-4">
        {loading ? (
          <p>Extracting text...</p>
        ) : (
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            placeholder="Extracted text from the image"
            className="p-2 border rounded-md w-full"
            rows={4}
          />
        )}
      </div>

      {/* Generate Image Section */}
      <div className="w-full flex justify-center items-center">
        <button
          onClick={() =>
            generateImageFromText(extractedText || "A delicious food item")
          } // Use extracted text as prompt
          className="ml-4 p-2 bg-blue-500 text-white rounded-md"
        >
          Generate Image
        </button>
      </div>

      {/* Generated Image Preview */}
      {generatedImage && (
        <div className="w-full h-full flex justify-center items-center border mt-4">
          <Image
            src={generatedImage}
            alt="Generated Image"
            width={500}
            height={500}
            className="rounded-lg w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
