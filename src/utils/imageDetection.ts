import { HfInference } from '@huggingface/inference';

const HF_TOKEN = 'YOUR_HUGGING_FACE_TOKEN'; // Replace with environment variable in production
const inference = new HfInference(HF_TOKEN);

export async function isRealPhoto(file: File): Promise<boolean> {
  try {
    const response = await inference.imageClassification({
      model: 'microsoft/resnet-50',
      data: file
    });

    // Check if the image appears to be a natural photo
    // This is a simplified check - you might want to adjust these criteria
    const naturalPhotoLabels = [
      'photograph', 'photo', 'picture', 'image', 'landscape',
      'portrait', 'nature', 'scenery', 'person', 'people'
    ];

    return response.some(prediction => 
      naturalPhotoLabels.some(label => 
        prediction.label.toLowerCase().includes(label) && 
        prediction.score > 0.7
      )
    );
  } catch (error) {
    console.error('Error detecting image type:', error);
    return false;
  }
}