import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message?: string;
}

export default function ErrorMessage({
  message = 'Произошла ошибка. Попробуйте позже',
}: ErrorMessageProps) {
  return <div className={styles.error}>{message}</div>;
}
