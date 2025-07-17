import { QuoteFormData } from '@/types/quote';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, Mail } from 'lucide-react';

interface StepSevenProps {
  formData: QuoteFormData;
  updateFormData: (updates: Partial<QuoteFormData>) => void;
}

export const StepSeven = ({ formData, updateFormData }: StepSevenProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">Almost Done!</h3>
        <p className="text-muted-foreground">
          Please provide your contact information to receive your instant quote
        </p>
      </div>

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
                placeholder="Enter your phone number"
                value={formData.customerPhone}
                onChange={(e) => updateFormData({ customerPhone: e.target.value })}
                className="w-full"
                type="tel"
                required
              />
              <p className="text-xs text-muted-foreground">
                We'll send your quote via WhatsApp to this number
              </p>
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
              <p className="text-xs text-muted-foreground">
                Your detailed quote will be emailed to this address
              </p>
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