import { useCallback, useRef } from 'react';
 
export function usePaymentPopup() {
  const popupRef = useRef(null);
 
  const openPopup = useCallback((url, name = 'PaymentPopup', width = 600, height = 700) => {
    const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left;
    const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top;
 
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
 
  const closePopup = useCallback(() => {
    if (popupRef.current && !popupRef.current.closed) {
      popupRef.current.close();
    }
  }, []);
 
  return { openPopup, closePopup };
}