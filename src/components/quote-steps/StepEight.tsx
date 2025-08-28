import { QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StepEightProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepEight = ({ formData, updateFormData }: StepEightProps) => {
  const { toast } = useToast();

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 10) {
      updateFormData({ customerPhone: value });
    }
    
    if (value.length === 10 && !validatePhoneNumber(value)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">{/* Form Section */}

      <div className="max-w-2xl mx-auto">
        <Card className="shadow-soft">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="customer-name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name *
              </Label>
              <Input
                id="customer-name"
                placeholder="Enter your full name"
                value={formData.customerName}
                onChange={(e) => updateFormData({ customerName: e.target.value })}
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-phone" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number *
              </Label>
              <Input
                id="customer-phone"
                placeholder="Enter your 10-digit phone number"
                value={formData.customerPhone}
                onChange={handlePhoneChange}
                className="w-full"
                type="tel"
                maxLength={10}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer-email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address *
              </Label>
              <Input
                id="customer-email"
                placeholder="Enter your email address"
                value={formData.customerEmail}
                onChange={(e) => updateFormData({ customerEmail: e.target.value })}
                className="w-full"
                type="email"
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 bg-success/10 border border-success/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-success flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div>
              <h4 className="font-medium text-success-foreground mb-1">Privacy & Security</h4>
              <p className="text-sm text-muted-foreground">
                Your information is secure and will only be used to provide you with storage quotes 
                and related services. We never share your data with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};