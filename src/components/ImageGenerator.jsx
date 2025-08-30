import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';           // ⬅️ If you manage user in context
import { useNavigate } from 'react-router-dom';               // ⬅️ For redirect after alert (optional)

const ImageGenerator = () => {
  const { user } = useContext(AppContext);                    // user is null when not logged-in
  const [prompt, setPrompt] = useState('');
  const [resultImage, setResultImage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to generate images.');
      navigate('/');       // or open login modal if you prefer
      return;
    }

    try {
      setLoading(true);
      setResultImage('');

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

  // 🔒 If not logged in, show a friendly message instead of the generator
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