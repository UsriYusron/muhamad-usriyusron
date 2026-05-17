// Server Component — fetch data lalu pass ke Footer
import { getLatestArticlesForFooter } from '@/lib/blog/actions';
import Footer from './Footer';

export default async function FooterWrapper() {
  const articles = await getLatestArticlesForFooter();
  return <Footer articles={articles} />;
}
