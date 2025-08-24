declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (input: HTMLInputElement, options?: google.maps.places.AutocompleteOptions) => google.maps.places.Autocomplete;
          AutocompleteService: new () => google.maps.places.AutocompleteService;
        };
        DistanceMatrixService: new () => google.maps.DistanceMatrixService;
        TravelMode: {
          DRIVING: google.maps.TravelMode;
          WALKING: google.maps.TravelMode;
          BICYCLING: google.maps.TravelMode;
          TRANSIT: google.maps.TravelMode;
        };
        UnitSystem: {
          METRIC: google.maps.UnitSystem;
          IMPERIAL: google.maps.UnitSystem;
        };
        DistanceMatrixStatus: {
          OK: google.maps.DistanceMatrixStatus;
          INVALID_REQUEST: google.maps.DistanceMatrixStatus;
          OVER_QUERY_LIMIT: google.maps.DistanceMatrixStatus;
          REQUEST_DENIED: google.maps.DistanceMatrixStatus;
          UNKNOWN_ERROR: google.maps.DistanceMatrixStatus;
          MAX_ELEMENTS_EXCEEDED: google.maps.DistanceMatrixStatus;
          MAX_DIMENSIONS_EXCEEDED: google.maps.DistanceMatrixStatus;
        };
        DistanceMatrixElementStatus: {
          OK: google.maps.DistanceMatrixElementStatus;
          NOT_FOUND: google.maps.DistanceMatrixElementStatus;
          ZERO_RESULTS: google.maps.DistanceMatrixElementStatus;
          MAX_ROUTE_LENGTH_EXCEEDED: google.maps.DistanceMatrixElementStatus;
        };
      };
    };
  }
}

declare namespace google.maps {
  enum TravelMode {
    DRIVING = 'DRIVING',
    WALKING = 'WALKING',
    BICYCLING = 'BICYCLING',
    TRANSIT = 'TRANSIT'
  }

  enum UnitSystem {
    METRIC = 0,
    IMPERIAL = 1
  }

  enum DistanceMatrixStatus {
    OK = 'OK',
    INVALID_REQUEST = 'INVALID_REQUEST',
    OVER_QUERY_LIMIT = 'OVER_QUERY_LIMIT',
    REQUEST_DENIED = 'REQUEST_DENIED',
    UNKNOWN_ERROR = 'UNKNOWN_ERROR',
    MAX_ELEMENTS_EXCEEDED = 'MAX_ELEMENTS_EXCEEDED',
    MAX_DIMENSIONS_EXCEEDED = 'MAX_DIMENSIONS_EXCEEDED'
  }

  enum DistanceMatrixElementStatus {
    OK = 'OK',
    NOT_FOUND = 'NOT_FOUND',
    ZERO_RESULTS = 'ZERO_RESULTS',
    MAX_ROUTE_LENGTH_EXCEEDED = 'MAX_ROUTE_LENGTH_EXCEEDED'
  }

  interface DistanceMatrixService {
    getDistanceMatrix(
      request: DistanceMatrixRequest,
      callback: (response: DistanceMatrixResponse | null, status: DistanceMatrixStatus) => void
    ): void;
  }

  interface DistanceMatrixRequest {
    origins: string[];
    destinations: string[];
    travelMode: TravelMode;
    unitSystem: UnitSystem;
    avoidHighways?: boolean;
    avoidTolls?: boolean;
  }

  interface DistanceMatrixResponse {
    rows: DistanceMatrixResponseRow[];
  }

  interface DistanceMatrixResponseRow {
    elements: DistanceMatrixResponseElement[];
  }

  interface DistanceMatrixResponseElement {
    status: DistanceMatrixElementStatus;
    distance?: {
      text: string;
      value: number;
    };
    duration?: {
      text: string;
      value: number;
    };
  }

  namespace places {
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
}

export {};