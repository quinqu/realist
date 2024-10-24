import React, { useState, useEffect } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Header } from './components/Header';
import { PinGrid } from './components/PinGrid';
import { UploadModal } from './components/UploadModal';
import { Pin } from './types';
import { getAllPhotos } from './utils/db';

function App() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pins, setPins] = useState<Pin[]>([]);

  useEffect(() => {
    // Load photos from database
    const loadPhotos = async () => {
      const photos = await getAllPhotos();
      setPins(photos.map(photo => ({
        id: photo.id.toString(),
        title: photo.title,
        description: photo.description,
        imageUrl: photo.filepath,
        author: 'User', // In a real app, you'd fetch user details
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
      })));
    };

    loadPhotos();
  }, []);

  const handleUpload = (file: File, title: string, description: string) => {
    const imageUrl = URL.createObjectURL(file);
    
    const newPin: Pin = {
      id: Date.now().toString(),
      title,
      description,
      imageUrl,
      author: 'Current User',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde'
    };
    
    setPins([newPin, ...pins]);
  };

  return (
    <Auth0Provider
      domain="YOUR_AUTH0_DOMAIN"
      clientId="YOUR_AUTH0_CLIENT_ID"
      authorizationParams={{
        redirect_uri: window.location.origin
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Header onUploadClick={() => setIsUploadModalOpen(true)} />
        
        <main className="max-w-7xl mx-auto px-4 pt-20 pb-8">
          <PinGrid pins={pins} />
        </main>

        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUpload={handleUpload}
        />
      </div>
    </Auth0Provider>
  );
}

export default App;