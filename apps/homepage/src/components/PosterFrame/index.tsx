import * as styles from "./styles.css";

type Props = {
  imageURL: string;
  alt: string;
};

// 포스터는 4:5 비율로 제작되므로, 포스터가 아직 없어도 같은 비율의 자리를 잡아둔다.
// 너비는 이 컴포넌트를 쓰는 쪽에서 정한다.
function PosterFrame({ imageURL, alt }: Props) {
  return (
    <div className={styles.frame}>
      {imageURL ? (
        <img src={imageURL} alt={alt} className={styles.poster} />
      ) : (
        <p className={styles.placeholder}>포스터 준비 중입니다</p>
      )}
    </div>
  );
}

export default PosterFrame;
