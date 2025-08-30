import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ImageGenerator = () => {
  const { user } = useContext(AppContext);
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to generate images.');
      navigate('/'); // redirect to home or open login modal
      return;
    }

    try {
      setLoading(true);
      setResultImage('');

      const response = await axios.post(
        'https://imagify-backend-3.onrender.com/api/image/generate-image',
        { prompt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Adjust based on your backend response structure
      // If your backend returns { image: "<image_url>" }
      if (response.data.image) {
        setResultImage(response.data.image);
      } else if (response.data.resultImage) {
        setResultImage(response.data.resultImage);
      } else {
        alert(response.data.message || 'Failed to generate image.');
      }
    } catch (error) {
      console.error('Generate Image Error:', error.response || error);
      alert(
        error.response?.data?.message ||
          'Something went wrong while generating the image.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-4 max-w-md mx-auto text-center">
        <h2 className="text-xl font-semibold mb-4">AI Image Generator</h2>
        <p className="text-red-600">
          Please log in to access the image generator.
        </p>
      </div>
    );
  }

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

          <a
            href={resultImage}
            download={`generated-image-${prompt.replace(/\s+/g, '_')}.png`}
            className="inline-block mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
