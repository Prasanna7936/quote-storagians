import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Package, Clock, Truck, Calculator, Download } from 'lucide-react';
import { QuoteFormData, QuoteResult } from '@/types/quote';
import { StepOne } from './quote-steps/StepOne';
import { StepTwo } from './quote-steps/StepTwo';
import { StepThree } from './quote-steps/StepThree';
import { StepFour } from './quote-steps/StepFour';
import { StepFive } from './quote-steps/StepFive';
import { StepSix } from './quote-steps/StepSix';
import { StepSeven } from './quote-steps/StepSeven';
import { StepEight } from './quote-steps/StepEight';
import { CallbackForm } from './quote-steps/CallbackForm';
import { DocumentStepThree } from './quote-steps/DocumentStepThree';
import { DocumentStepFour } from './quote-steps/DocumentStepFour';
import { DocumentStepFive } from './quote-steps/DocumentStepFive';
import { QuoteResults } from './QuoteResults';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateQuote } from '@/utils/quoteCalculator';
import { GoogleMapsSetup } from './GoogleMapsSetup';

const TOTAL_STEPS = 8;
const DOCUMENT_TOTAL_STEPS = 8;

const initialFormData: QuoteFormData = {
  storageType: 'household',
  duration: '3-6months',
  furniture: { extraLarge: 0, large: 0, medium: 0, small: 0 },
  appliances: { extraLarge: 0, large: 0, medium: 0, small: 0 },
  boxes: { luggage: 0, kitchen: 0, clothes: 0, booksPersonal: 0 },
  deliveryMethod: 'pickup',
  pickupLocation: '',
  areaPincode: '',
  pickupDate: null,
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  documentBoxRequirement: undefined,
  documentStorageType: undefined,
  documentBoxCount: undefined,
};

export const QuoteGenerator = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuoteFormData>(initialFormData);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const { toast } = useToast();

  const updateFormData = (updates: Partial<QuoteFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isDocumentFlow = formData.storageType === 'document';
  const maxSteps = isDocumentFlow ? DOCUMENT_TOTAL_STEPS : TOTAL_STEPS;

  const nextStep = () => {
    // If callback is selected, skip to step 2 (callback form)
    if (formData.storageType === 'callback' && currentStep === 1) {
      setCurrentStep(2);
      return;
    }
    
    // Validate pickup location for step 7 when pickup method is selected
    if (currentStep === 7 && formData.deliveryMethod === 'pickup' && !formData.pickupLocation.trim()) {
      toast({
        title: "Pickup location required",
        description: "Please enter your pickup location to continue.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < maxSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const generateQuote = async () => {
    try {
      // Show loading toast
      toast({
        title: "Generating quote...",
        description: "Please wait while we calculate your storage quote.",
      });

      const calculatedQuote = calculateQuote(formData);
      setQuote(calculatedQuote);

      // Send quote emails to both company and customer
      const { error } = await supabase.functions.invoke('send-quote-email', {
        body: {
          formData,
          quote: calculatedQuote,
          type: 'new_quote'
        }
      });

      if (error) {
        console.error('Error sending quote email:', error);
        toast({
          title: "Quote generated!",
          description: "Your quote is ready. Note: Email notification failed to send.",
          variant: "default",
        });
      } else {
        toast({
          title: "Quote generated!",
          description: "Your quote is ready and email notifications have been sent.",
          variant: "default",
        });
      }

    } catch (error) {
      console.error('Error generating quote:', error);
      const calculatedQuote = calculateQuote(formData);
      setQuote(calculatedQuote);
      
      toast({
        title: "Quote generated!",
        description: "Your quote is ready. Note: Email notification failed to send.",
        variant: "default",
      });
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormData(initialFormData);
    setQuote(null);
  };

  const handleCallbackSubmit = () => {
    // Reset form and go back to step 1
    resetForm();
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return Package;
      case 2: return Clock;
      case 3: return Package;
      case 4: return Package;
      case 5: return Package;
      case 6: return Truck;
      case 7: return Truck;
      case 8: return Calculator;
      default: return Package;
    }
  };

  const getStepTitle = (step: number) => {
    const isDropMethod = formData.deliveryMethod === 'third-party';
    
    if (isDocumentFlow) {
      switch (step) {
        case 1: return 'Storage Type';
        case 2: return 'Duration';
        case 3: return 'Box Requirement';
        case 4: return 'Storage Type';
        case 5: return 'Number of Boxes';
        case 6: return 'Shifting Options';
        case 7: return isDropMethod ? 'Drop Details' : 'Pickup Details';
        case 8: return 'Your Information';
        default: return 'Step';
      }
    } else {
      switch (step) {
        case 1: return 'Storage Type';
        case 2: return 'Duration';
        case 3: return 'Furniture';
        case 4: return 'Appliances';
        case 5: return 'Boxes & Luggage';
        case 6: return 'Shifting Options';
        case 7: return isDropMethod ? 'Drop Details' : 'Pickup Details';
        case 8: return 'Your Information';
        default: return 'Step';
      }
    }
  };

  if (quote) {
    return <QuoteResults quote={quote} formData={formData} onReset={resetForm} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          {currentStep === 1 && (
            <img 
              src="/lovable-uploads/storagians-logo-full.png" 
              alt="Storagians Logo" 
              className="h-16 mx-auto mb-6"
            />
          )}
          {currentStep === 1 && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get an instant quote for your storage needs
            </p>
          )}
        </div>

        {/* Progress Bar - Hide for callback flow */}
        {formData.storageType !== 'callback' && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Step {currentStep} of {maxSteps}
              </span>
              <span className="text-sm font-medium text-primary">
                {Math.round((currentStep / maxSteps) * 100)}% Complete
              </span>
            </div>
            <Progress value={(currentStep / maxSteps) * 100} className="h-2" />
            
            {/* Step indicators - Icons only */}
            <div className="flex justify-between mt-4">
              {Array.from({ length: maxSteps }, (_, i) => {
                const step = i + 1;
                const Icon = getStepIcon(step);
                const isActive = step === currentStep;
                const isCompleted = step < currentStep;
                
                return (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                      ${isActive ? 'bg-primary text-primary-foreground shadow-medium' : 
                        isCompleted ? 'bg-success text-accent-foreground' : 
                        'bg-muted text-muted-foreground'}
                    `}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Form Content */}
        <Card className="max-w-4xl mx-auto shadow-medium animate-slide-up">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl font-semibold">
              {formData.storageType === 'callback' && currentStep === 2 ? 'Request Call Back' : getStepTitle(currentStep)}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            {currentStep === 1 && (
              <StepOne 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 2 && formData.storageType === 'callback' && (
              <CallbackForm onSubmit={handleCallbackSubmit} onCancel={resetForm} />
            )}
            {currentStep === 2 && formData.storageType !== 'callback' && (
              <StepTwo 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {/* Household Flow Steps */}
            {currentStep === 3 && !isDocumentFlow && (
              <StepThree 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 4 && !isDocumentFlow && (
              <StepFour 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 5 && !isDocumentFlow && (
              <StepFive 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 6 && !isDocumentFlow && (
              <StepSix 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 7 && !isDocumentFlow && (
              <>
      <GoogleMapsSetup />
                <StepSeven 
                  formData={formData} 
                  updateFormData={updateFormData} 
                />
              </>
            )}
            {currentStep === 8 && !isDocumentFlow && (
              <StepEight 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}

            {/* Document Flow Steps */}
            {currentStep === 3 && isDocumentFlow && (
              <DocumentStepThree 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 4 && isDocumentFlow && (
              <DocumentStepFour 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 5 && isDocumentFlow && (
              <DocumentStepFive 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 6 && isDocumentFlow && (
              <StepSix 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}
            {currentStep === 7 && isDocumentFlow && (
              <>
                <GoogleMapsSetup />
                <StepSeven 
                  formData={formData} 
                  updateFormData={updateFormData} 
                />
              </>
            )}
            {currentStep === 8 && isDocumentFlow && (
              <StepEight 
                formData={formData} 
                updateFormData={updateFormData} 
              />
            )}

            {/* Navigation Buttons - Hide for callback form */}
            {!(formData.storageType === 'callback' && currentStep === 2) && (
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  size="lg"
                >
                  Previous
                </Button>
                
                {currentStep === maxSteps ? (
                  <Button 
                    variant="wizard" 
                    onClick={generateQuote}
                    size="lg"
                    className="min-w-32"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Get Quote
                  </Button>
                ) : (
                  <Button 
                    variant="gradient" 
                    onClick={nextStep}
                    size="lg"
                  >
                    Next Step
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};