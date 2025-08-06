import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// One components for the pages
function HomePage() {

// Google Drive API constants
const FOLDER_ID = '';
const API_KEY = '';

// State for storing files and error
const [files, setFiles] = useState([]);
const [error, setError] = useState(null);
const [fetchedData, setFetchedData] = useState(null);

// useNavigate hook for navigation
const navigate = useNavigate();

// Fetch files from Google Drive API when component mounts
  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    fetch(
      `https://www.googleapis.com/drive/v3/files?q=%27${FOLDER_ID}%27+in+parents&fields=files(id,name,mimeType,webViewLink)&key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.files) {
          setFiles(data.files);
                    fetchedData = data.files;

            // Log the fetched files for debugging
                    console.log(  'Files fetched successfully:', fetchedData);
            setFetchedData(fetchedData);

        //   console.log(  'Files fetched successfully:', data.files);
        } else {
          setError('No files found or check your API key.');
        }
      })
      .catch((err) => {
        console.error('Error fetching files:', err);
        setError('Error fetching files.');
      });
       

  };

   const handleViewDetails = (id, file) => {
    // Navigate to details page with ID
    navigate(`/details/${id}`, { state: { data: file } });
    console.log('Navigating to details with ID:', id);
    // console.log('Navigating to details with data :', data);

  };

  return (

<div className="main">
  <div className='nine'> <h1>Pdf viewer</h1></div>
  <div className="cards">
          {files.map((file) => (
        <div key={file.id} className="single-card">
          <div className="card_content">
            <h2 className="card_title">{file.name.substring(0, file.name.lastIndexOf('.')) || file.name}</h2>
            <button onClick={() => handleViewDetails(file.id, file)} className="btn card_btn">Read Now</button>
          </div>
        </div>
          ))}
  </div>
</div>
  );
}

// One page component
function DetailsPage(  ) {
  const location = useLocation();
  const { data } = location.state || {}; // fallback if no state

  return (
      <div className="iframe-container">
             {data ? (
        <div>
          <div className="nine">
           <h1> {data.name.substring(0, data.name.lastIndexOf('.')) || data.name} </h1> 
          </div>
      <iframe src={`https://drive.google.com/file/d/${data.id}/preview`} allow="autoplay"
        title={data.name} style={{ border: 'none' }}> </iframe>
        </div>
      ) : (
        <p>No data received</p>
      )}
     </div>
  );
}

// Default Page Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/details/:id" element={<DetailsPage  />} />
      </Routes>
    </Router>
  );
}

export default App;