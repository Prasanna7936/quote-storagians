import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const GoogleMapsSetup = () => {
  const hasGoogleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (hasGoogleMapsKey) {
    return null;
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Setup Required:</strong> To enable distance calculation and accurate pickup charges, please add your Google Maps API key as <code>VITE_GOOGLE_MAPS_API_KEY</code> in your environment variables. 
        <br />
        <span className="text-xs mt-1 block">
          Get your API key at <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a> and enable Places API and Distance Matrix API.
        </span>
      </AlertDescription>
    </Alert>
  );
};