import type { Metadata } from 'next';
import DkdAnyelaBornLoginClient from './DkdAnyelaBornLoginClient';

export const metadata: Metadata = {
  title: 'Anyela Born Club | Login',
  description:
    'Anyela Born Club için premium mobil uyumlu giriş ve üyelik deneyimi.',
};

export default function DkdAnyelaBornPage() {
  return <DkdAnyelaBornLoginClient />;
}
