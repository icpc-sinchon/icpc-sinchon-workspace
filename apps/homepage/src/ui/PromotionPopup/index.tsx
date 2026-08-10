import { getPromotionData } from "src/utils/getPromotionData";
import PromotionPopupClient from "./PromotionPopupClient";

// 홍보 팝업은 현재 시즌 데이터에서 showPopup을 켜고, 보여줄 내용이 있을 때만 띄운다
function PromotionPopup() {
  const promotionData = getPromotionData();

  if (!promotionData?.showPopup) {
    return null;
  }

  if (!promotionData.posterURL && !promotionData.applyLink) {
    return null;
  }

  return <PromotionPopupClient {...promotionData} />;
}

export default PromotionPopup;
