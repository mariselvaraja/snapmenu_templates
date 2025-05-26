import { useCallback, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { 
  fetchTpnConfigRequest, 
  clearTpnConfig, 
  clearTpnError,
  setTpnConfig,
  type TpnConfig 
} from '../redux/slices/tpnSlice';

/**
 * Custom hook for managing TPN (Third Party Network) payment state
 * @returns Object containing TPN state and actions
 */
export const usePayment = () => {

    const [isPaymentAvilable, setIsPaymentAvilable] = useState(false);
    const [config, setConfing] = useState([]);
  
    const restaurant_id = sessionStorage.getItem("franchise_id");

  // Select TPN state from Redux store
  const tpnState = useAppSelector((state) => state?.tpn?.rawApiResponse);

  useEffect(()=>{
    if(tpnState?.tpn_config)
      {
        setConfing(tpnState?.tpn_config)
      }
      else
      {
        setConfing([])
      }
  },[tpnState])

  useEffect(()=>{
    let isDataAvilable = config?.find((c:any)=>c?.restaurant_id == restaurant_id && c?.pos_type != null)
    setIsPaymentAvilable(isDataAvilable?true:false);
  },[config])
  
  
  return {
    isPaymentAvilable
  };
};

export default usePayment;
