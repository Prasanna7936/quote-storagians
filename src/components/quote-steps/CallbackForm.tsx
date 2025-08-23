import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, User, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface CallbackFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export const CallbackForm = ({ onSubmit, onCancel }: CallbackFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.mobile.trim()) {
      toast({
        title: "Required fields missing",
        description: "Please fill in your name and mobile number.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-callback-email', {
        body: {
          name: formData.name.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim() || undefined,
          remarks: formData.remarks.trim() || undefined
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Request submitted successfully!",
        description: "Our team will contact you shortly.",
      });
      
      onSubmit();
    } catch (error) {
      console.error('Error sending callback request:', error);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-medium">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-xl font-semibold">Request Call Back</CardTitle>
          <p className="text-sm text-muted-foreground">
            Our team will contact you shortly with a personalized quote
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Name *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Mobile Number *
              </Label>
              <Input
                id="mobile"
                type="tel"
                value={formData.mobile}
                onChange={(e) => updateField('mobile', e.target.value)}
                placeholder="Enter your mobile number"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-mail ID (optional)
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="Enter your email address"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks" className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Remarks
              </Label>
              <Textarea
                id="remarks"
                value={formData.remarks}
                onChange={(e) => updateField('remarks', e.target.value)}
                placeholder="Any specific requirements or additional information"
                className="w-full min-h-20"
                rows={3}
              />
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                type="button"
                variant="outline" 
                className="flex-1" 
                size="lg"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1" 
                size="lg"
                variant="gradient"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Submit Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};