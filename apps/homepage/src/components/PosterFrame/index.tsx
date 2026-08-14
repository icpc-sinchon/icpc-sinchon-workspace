import * as styles from "./styles.css";

type Props = {
  imageURL: string;
  alt: string;
};

// 포스터가 아직 없으면 4:5 비율로 자리만 잡아두고,
// 포스터가 들어오면 여백 없이 원본 비율 그대로 보여준다.
// 너비는 이 컴포넌트를 쓰는 쪽에서 정한다.
function PosterFrame({ imageURL, alt }: Props) {
  if (!imageURL) {
    return (
      <div className={styles.emptyFrame}>
        <p className={styles.placeholder}>포스터 준비 중입니다</p>
      </div>
    );
  }

  return <img src={imageURL} alt={alt} className={styles.poster} />;
}

export default PosterFrame;
