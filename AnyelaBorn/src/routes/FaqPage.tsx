import { dkdFaqs } from '../data/dkdAnyelaData';
import { DkdPageHero } from '../components/DkdShared';
export function DkdFaqPage() { return <><DkdPageHero dkdKicker="SSS" dkdTitle="Güven, açıklık ve net kurallar." dkdText="Anyela’nın AI karakter olduğu, ödeme akışı ve içerik sınırları açık yazılır." /><section className="dkd-section"><div className="dkd-container dkd-faq-list">{dkdFaqs.map((dkdFaq) => <article key={dkdFaq.dkdQuestion} className="dkd-card dkd-faq-item"><h3>{dkdFaq.dkdQuestion}</h3><p>{dkdFaq.dkdAnswer}</p></article>)}</div></section></>; }
