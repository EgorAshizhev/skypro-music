import cn from 'classnames';
import styles from './Filter.module.css';

const filters = ['исполнителю', 'году выпуска', 'жанру'];

export default function Filter() {
  return (
    <div className={styles.centerblock__filter}>
      <div className={styles.filter__title}>Искать по:</div>
      {filters.map((filter) => (
        <div key={filter} className={cn(styles.filter__button, 'btn-text')}>
          {filter}
        </div>
      ))}
    </div>
  );
}
