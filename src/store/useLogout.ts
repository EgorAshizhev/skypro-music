import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/authSlice';

// Общая логика выхода из аккаунта: используется и в Sidebar, и в Navigation,
// чтобы поведение (в т.ч. редирект со страницы избранного на главную) было
// одинаковым независимо от того, откуда пользователь нажал "Выйти".
export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  return function handleLogout() {
    dispatch(logout());
    // Со страницы избранного при выходе уводим на главную, а не на /signin —
    // остальные страницы по-прежнему ведут на форму входа.
    if (pathname.startsWith('/playlist')) {
      router.push('/');
    } else {
      router.push('/signin');
    }
  };
}
