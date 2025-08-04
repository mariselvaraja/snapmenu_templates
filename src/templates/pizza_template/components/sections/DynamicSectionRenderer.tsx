import React from 'react';
import { useAppSelector } from '../../../../common/redux';
import ExperienceSection from './ExperienceSection';
import PopularItemsSection from './PopularItemsSection';
import OffersSection from './OffersSection';
import { ComboSection } from '../ComboSection';
import { usePayment } from '@/hooks';

interface DynamicSectionRendererProps {
  onOpenModifierModal?: (menuItem: any) => void;
}

export const DynamicSectionRenderer: React.FC<DynamicSectionRendererProps> = ({ onOpenModifierModal }) => {
  const { rawApiResponse } = useAppSelector(state => state.siteContent);
  const { data: comboData, loading: comboLoading, error: comboError } = useAppSelector(state => state.combo);
  const { isPaymentAvilable } = usePayment();
  
  // Get site content from Redux state
  const siteContent = rawApiResponse ? 
    (typeof rawApiResponse === 'string' ? JSON.parse(rawApiResponse) : rawApiResponse) : 
    {};
  const homepage = siteContent.homepage;
  const siteConfiguration = siteContent?.siteConfiguration;
  
  // Get sectionOrder from homepage
  const sectionOrder = homepage?.sectionOrder || [];
  
  // Use the sectionOrder from API, or fallback to default order if none provided
  const finalSectionOrder = sectionOrder.length > 0 ? sectionOrder : ['offers', 'popularitems', 'experience', 'combos'];
  
  // Get combo isActive from homepage content
  const comboIsActive = homepage?.combo?.isActive || false;

  // Section component mapping
  const sectionComponents = {
    'offers': () => <OffersSection onOpenModifierModal={onOpenModifierModal} />,
    'popularitems': () => <PopularItemsSection onOpenModifierModal={onOpenModifierModal} />,
    'experience': () => <ExperienceSection />,
    'combos': () => (
      <ComboSection 
        comboData={{ isActive: comboIsActive, data: comboData || [] }}
        siteConfiguration={siteConfiguration}
        isPaymentAvailable={isPaymentAvilable}
        comboLoading={comboLoading}
      />
    )
  };

  // Use finalSectionOrder for rendering
  if (!finalSectionOrder || !Array.isArray(finalSectionOrder) || finalSectionOrder.length === 0) {
    return null;
  }

  return (
    <>
      {finalSectionOrder.map((sectionType: string, index: number) => {
        const SectionComponent = sectionComponents[sectionType as keyof typeof sectionComponents];
        
        if (!SectionComponent) {
          console.warn(`Unknown section type: ${sectionType}`);
          return null;
        }
        
        return (
          <React.Fragment key={`${sectionType}-${index}`}>
            {SectionComponent()}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default DynamicSectionRenderer;
