import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const MapboxSetup = () => {
  const hasMapboxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  if (hasMapboxToken) {
    return null;
  }

  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-800 mb-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Setup Required:</strong> To enable distance calculation and accurate pickup charges, please add your Mapbox access token as <code>VITE_MAPBOX_TOKEN</code> in your environment variables. 
        <br />
        <span className="text-xs mt-1 block">
          Get your free token at <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
        </span>
      </AlertDescription>
    </Alert>
  );
};