import { useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Card } from './card';
import { ContactModal } from './ContactModal';

interface AdPriceActionProps {
  price: number;
  currency: string;
  originalPrice?: number | null;
  category: string;
  contactInfo: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    professional_phone?: string;
    phone_country?: string;
    whatsapp_country?: string;
    professional_phone_country?: string;
  };
  showOptions: {
    show_email: boolean;
    show_phone: boolean;
    show_whatsapp: boolean;
    show_professional_phone: boolean;
  };
  ownerName: string;
  isAuthenticated: boolean;
  endDate: string;
}

export const AdPriceAction = ({ 
  price, 
  currency, 
  originalPrice, 
  category,
  contactInfo,
  showOptions,
  ownerName,
  isAuthenticated,
  endDate
}: AdPriceActionProps) => {
  const isServiceCategory = ['guides', 'chauffeurs', 'babysitting'].includes(category);
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  // Check if it's a flash deal
  const isFlashDeal = hasDiscount && discountPercent >= 30;
  const daysLeft = Math.ceil((new Date(endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isFlash = isFlashDeal && daysLeft <= 7 && daysLeft > 0;

  const getPriceColor = () => {
    if (hasDiscount) return 'text-green-600';
    return 'text-primary';
  };

  return (
    <>
      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between space-x-4">
            {/* Price Section */}
            <div className="flex-1">
              <div className="text-center space-y-1">
                {/* Original price if discounted */}
                {hasDiscount && (
                  <div className="text-sm text-muted-foreground line-through">
                    {originalPrice} {currency}
                  </div>
                )}
                
                {/* Current price */}
                <div className={`text-2xl font-bold ${getPriceColor()}`}>
                  {isServiceCategory && price === 0 
                    ? 'Sur devis' 
                    : `${price} ${currency}`}
                </div>
                
                {/* Discount badge */}
                {hasDiscount && (
                  <div className="flex justify-center">
                    <Badge 
                      className={`text-xs px-2 py-1 ${
                        isFlash 
                          ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isFlash ? `⚡ -${discountPercent}%` : `-${discountPercent}%`}
                    </Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <ContactModal
                contactInfo={contactInfo}
                showOptions={showOptions}
                ownerName={ownerName}
                isAuthenticated={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content being hidden behind fixed bar */}
      <div className="h-20" />
    </>
  );
};