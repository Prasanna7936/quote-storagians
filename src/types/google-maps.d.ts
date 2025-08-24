declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
          AutocompleteService: new () => google.maps.places.AutocompleteService;
        };
      };
    };
  }
}

declare namespace google.maps.places {
  interface AutocompleteOptions {
    componentRestrictions?: { country: string };
    fields?: string[];
    types?: string[];
  }

  interface Autocomplete {
    addListener(eventName: string, handler: () => void): void;
    getPlace(): {
      formatted_address?: string;
      geometry?: {
        location: {
          lat(): number;
          lng(): number;
        };
      };
    };
  }

  interface AutocompleteService {}
}

export {};