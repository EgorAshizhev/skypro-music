import styles from './page.module.css';
import Navigation from '@/app/components/Navigation/Navigation';
import Centerblock from '@/app/components/Centerblock/Centerblock';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Bar from '@/app/components/Bar/Bar';

export default function MainPage() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          <Centerblock />
          <Sidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
