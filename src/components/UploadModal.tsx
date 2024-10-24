import React, { useState } from 'react';
import { X, Upload, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { handleFileUpload } from '../utils/fileUpload';
import { isRealPhoto } from '../utils/imageDetection';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, title: string, description: string) => void;
}

export function UploadModal({ isOpen, onClose, onUpload }: UploadModalProps) {
  const { user } = useAuth0();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }

      setIsChecking(true);
      setError(null);

      try {
        const isReal = await isRealPhoto(file);
        if (!isReal) {
          setError('This image appears to be AI-generated or not a natural photo.');
          setIsChecking(false);
          return;
        }

        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
          setSelectedFile(file);
          setError(null);
          setIsChecking(false);
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setError('Error verifying image. Please try again.');
        setIsChecking(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile && title && user?.sub) {
      try {
        setIsChecking(true);
        await handleFileUpload(selectedFile, user.sub, title, description);
        onUpload(selectedFile, title, description);
        onClose();
      } catch (err) {
        setError('Failed to upload image. Please try again.');
      } finally {
        setIsChecking(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Upload a Real Photo</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {isChecking ? (
                <div className="space-y-4">
                  <Loader2 className="mx-auto h-12 w-12 text-red-500 animate-spin" />
                  <p className="text-gray-600">Verifying image...</p>
                </div>
              ) : previewUrl ? (
                <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto" />
              ) : (
                <div className="space-y-4">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div>
                    <label className="cursor-pointer text-red-500 hover:text-red-600 font-medium">
                      Choose a file
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </label>
                    <p className="text-gray-500 text-sm mt-1">or drag and drop</p>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="mt-2 flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || !title || isChecking}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}