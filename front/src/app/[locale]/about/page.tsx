'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

const AboutUs = () => {
  const t = useTranslations('AboutUs');
  const values = t.raw('values') as { title: string; desc: string }[];

  return (
    <div className="background bg-background">
      <main>
        <section className="flex flex-col items-start px-8 md:px-20 py-20 gap-6 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight max-w-2xl">{t('title')}</h1>

          <p className="text-lg text-muted max-w-xl">{t('subtitle')}</p>

          <div className="flex flex-wrap gap-4 items-center">
            <Link href="/register">
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors">{t('btnShip')}</button>
            </Link>

            <Link href="/register" className="text-foreground hover:text-primary-hover font-medium transition-colors">
              {t('btnRegister')}
            </Link>
          </div>

          {/* badges */}
          <div className="flex flex-wrap gap-6 text-sm text-primary font-medium">
            <span>{t('badge1')}</span>
            <span>{t('badge2')}</span>
            <span>{t('badge3')}</span>
          </div>

          <div className="w-full h-80 md:h-120 rounded-2xl bg-surface-muted relative overflow-hidden mt-4">
            <div className="absolute inset-0 flex items-center justify-center text-muted text-sm">
              <Image src="/images/hero-about.jpg" alt="Logistica Trackyfly" fill className="object-cover" />
            </div>
          </div>
        </section>

        <section className="flex flex-col md:flex-row gap-10 px-8 md:px-20 py-16 max-w-7xl mx-auto items-center">
          <div className="relative w-full md:w-1/2 h-64 md:h-80 rounded-2xl overflow-hidden shrink-0">
            <Image src="https://i.pinimg.com/1200x/70/46/bd/7046bd709a640bc6da2abf0567055842.jpg" alt="descripción" fill className="object-cover" />
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-foreground">{t('historyTitle')}</h2>

            <p className="text-muted leading-relaxed">{t('historyP1')}</p>

            <p className="text-muted leading-relaxed">{t('historyP2')}</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 md:px-20 py-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-3 bg-surface border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground">{t('missionTitle')}</h2>
            <p className="text-muted leading-relaxed">{t('missionDesc')}</p>
          </div>

          <div className="flex flex-col gap-3 bg-surface border border-border rounded-2xl p-8">
            <h2 className="text-xl font-bold text-foreground">{t('visionTitle')}</h2>
            <p className="text-muted leading-relaxed">{t('visionDesc')}</p>
          </div>
        </section>

        <section className="flex flex-col gap-8 px-8 md:px-20 py-12 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground">{t('valuesTitle')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col gap-2 border bg-surface border-border rounded-2xl p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-foreground">{v.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 px-8 py-20 text-center bg-background mt-8">
          <h2 className="text-3xl font-bold text-foreground">{t('ctaTitle')}</h2>

          <p className="text-muted max-w-md">{t('ctaSubtitle')}</p>

          <div className="flex flex-wrap gap-4 mt-2">
            <Link href="/register">
              <button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-lg font-medium transition-colors">{t('btnRegisterCta')}</button>
            </Link>

            <button className="border border-border hover:border-primary hover:text-primary-hover text-foreground px-6 py-3 rounded-lg font-medium transition-colors">{t('btnServices')}</button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
