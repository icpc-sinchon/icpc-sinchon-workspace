"use client";

import PosterFrame from "@components/PosterFrame";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PromotionData } from "src/utils/getPromotionData";
import * as styles from "./styles.css";

const STORAGE_KEY_PREFIX = "icpc-sinchon-promotion-popup";

// 브라우저가 스토리지 사용을 막아둔 경우에도 팝업 자체는 동작해야 한다
function readStorageItem(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageItem(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // 저장에 실패하면 다음 방문에 팝업이 다시 보이는 것 외에 문제는 없다
  }
}

function getTodayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${today.getFullYear()}-${month}-${date}`;
}

function PromotionPopupClient({
  promotionId,
  contestTitle,
  contestPageURL,
  dateTime,
  posterURL,
  applyLink,
  applyPeriod,
}: PromotionData) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [hideToday, setHideToday] = useState(false);

  const hiddenDateKey = `${STORAGE_KEY_PREFIX}-${promotionId}-hidden-date`;
  const closedInSessionKey = `${STORAGE_KEY_PREFIX}-${promotionId}-closed`;
  const applyPeriodText = applyPeriod ? `참가 신청 기간 ${applyPeriod}` : "";

  // 방문자가 팝업을 닫았는지는 브라우저에만 기록되므로, 팝업은 마운트 이후에 띄운다
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) {
      return;
    }

    const hiddenDate = readStorageItem(window.localStorage, hiddenDateKey);
    const closedInSession = readStorageItem(
      window.sessionStorage,
      closedInSessionKey,
    );

    if (hiddenDate === getTodayKey() || closedInSession === "true") {
      return;
    }

    dialog.showModal();
    document.body.style.overflow = "hidden";
  }, [hiddenDateKey, closedInSessionKey]);

  const closePopup = () => {
    dialogRef.current?.close();
  };

  // 클릭 지점이 dialog 자신이면 내용 밖(배경)을 클릭한 것이다
  const handleBackdropClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) {
      closePopup();
    }
  };

  // 닫기 버튼, 배경 클릭, ESC 모두 close 이벤트로 모인다
  const handleClose = () => {
    if (hideToday) {
      writeStorageItem(window.localStorage, hiddenDateKey, getTodayKey());
    }

    writeStorageItem(window.sessionStorage, closedInSessionKey, "true");
    document.body.style.overflow = "";
  };

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: 키보드에서는 dialog가 기본 지원하는 ESC로 닫는다
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      onClose={handleClose}
      onClick={handleBackdropClick}
      aria-labelledby="promotion-popup-title"
    >
      <div className={styles.content}>
        <p className={styles.label}>참가자 모집</p>
        <h2 id="promotion-popup-title" className={styles.title}>
          {contestTitle}
        </h2>
        <PosterFrame imageURL={posterURL} alt={`${contestTitle} 포스터`} />
        <p className={styles.description}>{dateTime}</p>
        {applyPeriodText && (
          <p className={styles.description}>{applyPeriodText}</p>
        )}
        <div className={styles.buttonContainer}>
          {applyLink && (
            <a
              href={applyLink}
              target="_blank"
              rel="noreferrer"
              className={styles.applyButton}
            >
              참가 신청하기
            </a>
          )}
          <Link
            href={contestPageURL}
            className={styles.detailLink}
            onClick={closePopup}
          >
            대회 안내 보기
          </Link>
        </div>
      </div>
      <div className={styles.footer}>
        <label className={styles.hideTodayLabel}>
          <input
            type="checkbox"
            checked={hideToday}
            onChange={(event) => setHideToday(event.target.checked)}
          />
          오늘 하루 보지 않기
        </label>
        <button
          type="button"
          className={styles.closeButton}
          onClick={closePopup}
        >
          닫기
        </button>
      </div>
    </dialog>
  );
}

export default PromotionPopupClient;
