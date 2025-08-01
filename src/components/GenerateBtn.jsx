
import React, { useState } from 'react';
import axios from 'axios';

const GenerateBtn = () => {
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setResultImage('');

      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:4000/api/image/generate-image',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setResultImage(response.data.resultImage);
      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">AI Image Generator</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt..."
        className="w-full border p-2 rounded mb-4"
      />

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Generating...' : 'Generate Image'}
      </button>

      {resultImage && (
        <div className="mt-4">
          <img
            src={resultImage}
            alt="Generated"
            className="w-full rounded shadow"
          />
        </div>
      )}
    </div>
  );
};

export default GenerateBtn;

