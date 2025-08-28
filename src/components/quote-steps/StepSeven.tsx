import { QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Calendar as CalendarIcon, Truck, Package2, Navigation, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface StepSevenProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSeven = ({ formData, updateFormData }: StepSevenProps) => {
  const isThirdPartyDrop = formData.deliveryMethod === 'third-party';
  const isDropMethod = isThirdPartyDrop;
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [calculatedDistance, setCalculatedDistance] = useState<number | null>(null);
  const [pincodeError, setPincodeError] = useState<string>('');
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [autocompleteService, setAutocompleteService] = useState<any>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Extract pincode from address
  const extractPincodeFromAddress = (address: string): string | null => {
    const pincodeMatch = address.match(/\b\d{6}\b/);
    return pincodeMatch ? pincodeMatch[0] : null;
  };

  // Initialize Google Places
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        setAutocompleteService(new window.google.maps.places.AutocompleteService());
        
        if (autocompleteRef.current) {
          const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
            componentRestrictions: { country: 'in' },
            fields: ['formatted_address', 'geometry', 'address_components'],
            types: ['address']
          });

          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address && place.geometry) {
              updateFormData({ pickupLocation: place.formatted_address });
              
              // Auto-fill pincode from Google place
              const extractedPincode = extractPincodeFromAddress(place.formatted_address);
              if (extractedPincode && !formData.areaPincode) {
                updateFormData({ areaPincode: extractedPincode });
                setPincodeError('');
              }
              
              // Auto-calculate distance with confirmed Google location
              calculateDistance(place.formatted_address, extractedPincode || formData.areaPincode);
            }
          });
        }
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY'}&libraries=places,geocoding`;
      script.async = true;
      script.defer = true;
      script.onload = () => loadGoogleMaps();
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Validate pincode
  const validatePincode = (pincode: string): boolean => {
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit pincode');
      return false;
    }
    setPincodeError('');
    return true;
  };

  // Fetch location suggestions from pincode using Google Geocoding API
  const fetchLocationFromPincode = async (pincode: string) => {
    if (!validatePincode(pincode)) return;
    
    setIsFetchingLocation(true);
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    
    try {
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API not loaded');
      }

      const geocoder = new (window.google.maps as any).Geocoder();
      
      geocoder.geocode(
        { 
          address: `${pincode}, Karnataka, India`,
          componentRestrictions: { country: 'IN' }
        },
        (results: any, status: any) => {
          try {
            if (status !== 'OK') {
              throw new Error('Invalid pincode or location not found');
            }

            if (!results || results.length === 0) {
              throw new Error('No locations found for this pincode');
            }

            // Extract unique area names from results
            const locations = results
              .map((result: any) => {
                // Get locality/sublocality from address components
                const components = result.address_components;
                const locality = components.find((comp: any) => 
                  comp.types.includes('locality') || 
                  comp.types.includes('sublocality_level_1') ||
                  comp.types.includes('sublocality')
                );
                
                return locality ? locality.long_name : result.formatted_address;
              })
              .filter((location: string, index: number, arr: string[]) => arr.indexOf(location) === index) // Remove duplicates
              .slice(0, 5); // Limit to top 5 suggestions

            if (locations.length === 1) {
              // Auto-fill if only one location found
              updateFormData({ pickupLocation: `${locations[0]}, ${pincode}` });
              toast.success('Location auto-filled from pincode');
              
              // Auto-calculate distance
              calculateDistance(`${locations[0]}, ${pincode}`, pincode);
            } else if (locations.length > 1) {
              // Show dropdown for multiple locations
              setLocationSuggestions(locations);
              setShowLocationDropdown(true);
              toast.info('Multiple areas found. Please select your location.');
            }

          } catch (error) {
            console.error('Geocoding error:', error);
            setPincodeError('Invalid pincode or location not found');
            updateFormData({ pickupLocation: '' });
          } finally {
            setIsFetchingLocation(false);
          }
        }
      );
      
    } catch (error) {
      console.error('Location fetch error:', error);
      setPincodeError('Unable to fetch location. Please enter manually.');
      setIsFetchingLocation(false);
    }
  };

  // Handle location selection from dropdown
  const handleLocationSelection = (selectedLocation: string) => {
    const fullLocation = `${selectedLocation}, ${formData.areaPincode}`;
    updateFormData({ pickupLocation: fullLocation });
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
    
    toast.success('Location selected');
    
    // Auto-calculate distance with selected location
    calculateDistance(fullLocation, formData.areaPincode);
  };

  // Handle pincode input with auto location fetching
  const handlePincodeChange = (pincode: string) => {
    updateFormData({ areaPincode: pincode });
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
    
    if (pincode.length === 6) {
      const isValid = validatePincode(pincode);
      if (isValid) {
        // Fetch location suggestions from pincode
        fetchLocationFromPincode(pincode);
      }
    } else if (pincode.length > 0) {
      setPincodeError('');
      updateFormData({ pickupLocation: '' }); // Clear location when pincode changes
    }
  };

  // Auto calculate distance when pincode is valid (fallback when no Google location)
  useEffect(() => {
    if (formData.areaPincode && 
        formData.areaPincode.length === 6 && 
        validatePincode(formData.areaPincode) && 
        (!formData.pickupLocation || formData.pickupLocation.trim().length <= 10) &&
        formData.deliveryMethod === 'pickup') {
      calculateDistance(undefined, formData.areaPincode);
    }
  }, [formData.areaPincode, formData.pickupLocation, formData.deliveryMethod]);

  const calculateDistance = async (address?: string, pincode?: string) => {
    setIsCalculatingDistance(true);
    try {
      if (!window.google || !window.google.maps) {
        throw new Error('Google Maps API not loaded');
      }

      // Determine the origin address
      let originAddress = '';
      if (address && address.trim().length > 10) {
        // Use Google Maps address if properly entered
        originAddress = address;
      } else if (pincode && validatePincode(pincode)) {
        // Fallback to pincode
        originAddress = `${pincode}, Karnataka, India`;
      } else {
        throw new Error('Please provide either a complete address or valid pincode');
      }

      // Warehouse coordinates (Seegehalli)
      const warehouseAddress = 'Seegehalli, Bengaluru, Karnataka, India';
      
      // Use Google Maps JavaScript API DistanceMatrixService
      const service = new window.google.maps.DistanceMatrixService();
      
      service.getDistanceMatrix(
        {
          origins: [originAddress],
          destinations: [warehouseAddress],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
          try {
            if (status !== window.google.maps.DistanceMatrixStatus.OK) {
              throw new Error(`Distance Matrix API error: ${status}`);
            }

            if (!response || !response.rows || response.rows.length === 0) {
              throw new Error('No distance data found');
            }

            const element = response.rows[0].elements[0];

            if (element.status !== window.google.maps.DistanceMatrixElementStatus.OK) {
              throw new Error(`Distance calculation failed: ${element.status}`);
            }

            if (!element.distance || !element.distance.value) {
              throw new Error('Distance value not found');
            }

            const distanceInMeters = element.distance.value;
            const distanceInKm = Math.round(distanceInMeters / 1000);

            setCalculatedDistance(distanceInKm);
            updateFormData({ distanceKm: distanceInKm });

            const locationSource = address && address.trim().length > 10 ? 'address' : 'pincode';
            toast.success(`Distance calculated: ${distanceInKm} km from warehouse (using ${locationSource})`);

          } catch (error) {
            console.error('Distance calculation error:', error);
            toast.error('Could not calculate distance. Please verify the location details.');
            setCalculatedDistance(null);
            updateFormData({ distanceKm: undefined });
          } finally {
            setIsCalculatingDistance(false);
          }
        }
      );
      
    } catch (error) {
      console.error('Distance calculation error:', error);
      toast.error(error instanceof Error ? error.message : 'Could not calculate distance.');
      setCalculatedDistance(null);
      updateFormData({ distanceKm: undefined });
      setIsCalculatingDistance(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Truck className="w-12 h-12 mx-auto mb-4 text-primary" />
        {isThirdPartyDrop && (
          <div className="text-muted-foreground mb-4 space-y-2">
            <p>• Make your own shifting arrangements</p>
            <p>• Our team will assist with Packing (if needed) and take care of Inventory</p>
          </div>
        )}
        <p className="text-muted-foreground">
          {isDropMethod 
            ? "When and where will you drop off your items?"
            : "When and where should we pick up your items?"
          }
        </p>
      </div>


      <div className="grid gap-6 md:grid-cols-2">
        {/* Location */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {isDropMethod ? 'Drop Location' : 'Pickup Location'}
          </Label>
          {isDropMethod ? (
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Drop Address</Label>
                <div className="p-3 rounded-md border bg-muted/30 text-sm">
                  #123/4, Pipeline Rd, Janashakthi Nagar, Kamath Layout, Vivekanandanagar, Bengaluru, Karnataka 562130
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Google Location Link</Label>
                <div className="p-3 rounded-md border bg-muted/30">
                  <a 
                    href="https://share.google/b0pCBCcBg0UkZWn4c" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm break-all"
                  >
                    https://maps.app.goo.gl/W5BtPuSuucQSVFPJ6
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Area Pincode - Mandatory */}
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-sm font-medium">
                  Area Pincode <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pincode"
                  type="text"
                  placeholder="Enter 6-digit pincode"
                  value={formData.areaPincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="text-base"
                  maxLength={6}
                  required
                />
                {pincodeError && (
                  <p className="text-sm text-destructive">{pincodeError}</p>
                )}
              </div>

              {/* Google Maps Address - Optional */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Complete Address <span className="text-muted-foreground">(Optional - for better accuracy)</span>
                </Label>
                <Input
                  ref={autocompleteRef}
                  id="location"
                  type="text"
                  placeholder="Enter your complete address (optional)"
                  value={formData.pickupLocation}
                  onChange={(e) => updateFormData({ pickupLocation: e.target.value })}
                  className="text-base"
                />
              </div>

              {/* Location fetching status */}
              {isFetchingLocation && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Navigation className="w-4 h-4 animate-spin" />
                  Fetching location suggestions...
                </div>
              )}

              {/* Location suggestions dropdown */}
              {showLocationDropdown && locationSuggestions.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Select your area:
                  </Label>
                  <Select onValueChange={handleLocationSelection}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationSuggestions.map((location, index) => (
                        <SelectItem key={index} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Distance calculation status and result */}
              {isCalculatingDistance && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg">
                  <Navigation className="w-4 h-4 animate-spin" />
                  Calculating distance automatically...
                </div>
              )}

              {/* Distance Result */}
              {calculatedDistance !== null && (
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/5 p-3 rounded-lg">
                  <Navigation className="w-4 h-4" />
                  Distance to warehouse: {calculatedDistance} km
                </div>
              )}
            </div>
          )}
        </div>

        {/* Date */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            {isDropMethod ? 'Drop Date' : 'Pickup Date'}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !formData.pickupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.pickupDate ? (
                  format(formData.pickupDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.pickupDate || undefined}
                onSelect={(date) => updateFormData({ pickupDate: date || null })}
                disabled={(date) =>
                  date < new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">{isDropMethod ? 'Drop Information:' : 'Pickup Information:'}</p>
              {isDropMethod ? (
                <ul className="space-y-1 text-xs">
                  <li>• Drop-off is available during business hours (9 AM - 6 PM)</li>
                  <li>• Please bring a valid ID for verification</li>
                  <li>• Our team will assist you with unloading</li>
                  <li>• Drop-off usually takes 30-60 minutes</li>
                </ul>
              ) : (
                <ul className="space-y-1 text-xs">
                  <li>• Our team will contact you to confirm the pickup time</li>
                  <li>• Our team brings all packing materials and tools for safe handling</li>
                  <li>• Pickup is usually completed within 3 to 5 hours, depending on the item list</li>
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};