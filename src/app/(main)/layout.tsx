import styles from './layout.module.css';
import Navigation from '@/app/components/Navigation/Navigation';
import Sidebar from '@/app/components/Sidebar/Sidebar';
import Bar from '@/app/components/Bar/Bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <main className={styles.main}>
          <Navigation />
          {children}
          <Sidebar />
        </main>
        <Bar />
        <footer className={styles.footer}></footer>
      </div>
    </div>
  );
}
