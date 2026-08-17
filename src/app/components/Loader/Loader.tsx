import styles from './Loader.module.css';

interface LoaderProps {
  text?: string;
}

export default function Loader({ text = 'Загрузка' }: LoaderProps) {
  return (
    <div className={styles.loader}>
      <span className={styles.spinner} aria-hidden="true" />
      <span>{text}</span>
    </div>
  );
}
