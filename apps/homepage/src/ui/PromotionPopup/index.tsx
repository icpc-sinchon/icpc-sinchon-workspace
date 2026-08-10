import { getPromotionData } from "src/utils/getPromotionData";
import PromotionPopupClient from "./PromotionPopupClient";

// 홍보 팝업은 현재 시즌 데이터에서 showPopup을 켰을 때만 띄운다
function PromotionPopup() {
  const promotionData = getPromotionData();

  if (!promotionData?.showPopup) {
    return null;
  }

  return <PromotionPopupClient {...promotionData} />;
}

export default PromotionPopup;
