import { useCallback, useRef } from 'react';

interface PopupOptions {
  name?: string;
  width?: number;
  height?: number;
}

export function usePaymentPopup() {
  const popupRef = useRef<Window | null>(null);

  const openPopup = useCallback((
    url: string, 
    name: string = 'PaymentPopup', 
    width: number = 600, 
    height: number = 700
  ): Window | null => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : (window.screen as any).left || 0;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : (window.screen as any).top || 0;

    const screenWidth = window.innerWidth || document.documentElement.clientWidth || screen.width;
    const screenHeight = window.innerHeight || document.documentElement.clientHeight || screen.height;

    const systemZoom = screenWidth / window.screen.availWidth;
    const left = (screenWidth - width) / 2 / systemZoom + dualScreenLeft;
    const top = (screenHeight - height) / 2 / systemZoom + dualScreenTop;

    const popup = window.open(
      url,
      name,
      `scrollbars=yes, width=${width}, height=${height}, top=${top}, left=${left}`
    );

    if (popup && popup.focus) {
      popup.focus();
    }

    popupRef.current = popup;

    return popup;
  }, []);

  const closePopup = useCallback((): void => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
  }, []);

  return { openPopup, closePopup };
}
