import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, BookOpen } from 'lucide-react';
import { MobileBottomNav } from '@/components/mobile/MobileBottomNav';
import '@/styles/guide-hajj.css';

const schoolColors = {
  hanafi: 'hsl(207, 60%, 50%)',
  maliki: 'hsl(120, 40%, 45%)',
  shafii: 'hsl(25, 55%, 55%)',
  hanbali: 'hsl(270, 35%, 50%)',
};

const CompareTable = ({ rows }: { rows: string[][] }) => (
  <div className="hajj-school-compare">
    <div className="hajj-compare-row hajj-header">
      <div className="hajj-compare-cell" style={{ color: schoolColors.hanafi }}>🔵 Hanafite</div>
      <div className="hajj-compare-cell" style={{ color: schoolColors.maliki }}>🟢 Malikite</div>
      <div className="hajj-compare-cell" style={{ color: schoolColors.shafii }}>🟠 Shafiite</div>
      <div className="hajj-compare-cell" style={{ color: schoolColors.hanbali }}>🟣 Hanbalite</div>
    </div>
    {rows.map((row, i) => (
      <div key={i} className="hajj-compare-row">
        {row.map((cell, j) => (
          <div key={j} className="hajj-compare-cell" dangerouslySetInnerHTML={{ __html: cell }} />
        ))}
      </div>
    ))}
  </div>
);

const FAQItem = ({ question, children, defaultOpen }: { question: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div className={`hajj-faq-item ${open ? 'open' : ''}`}>
      <div className="hajj-faq-question" onClick={() => setOpen(!open)}>
        <h3>{question}</h3>
        <span className="hajj-faq-toggle">+</span>
      </div>
      {open && <div className="hajj-faq-answer">{children}</div>}
    </div>
  );
};

const SchoolAnswer = ({ school, label, children }: { school: string; label: string; children: React.ReactNode }) => (
  <div className={`hajj-school-answer ${school}`}>
    <div className="hajj-school-answer-label">{label}</div>
    <p>{children}</p>
  </div>
);

const DivergenceCard = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
  <div className="hajj-divergence-card hajj-reveal">
    <div className="hajj-divergence-header">
      <span className="hajj-divergence-icon">{icon}</span>
      <div className="hajj-divergence-title">{title}</div>
    </div>
    <div className="hajj-divergence-body">
      <div className="hajj-divergence-grid">{children}</div>
    </div>
  </div>
);

const DgSchool = ({ school, label, children }: { school: string; label: string; children: React.ReactNode }) => (
  <div className={`hajj-dg-school ${school}`}>
    <div className="hajj-dg-label">{label}</div>
    <p>{children}</p>
  </div>
);

const GuideHajj4Ecoles = () => {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveals = pageRef.current?.querySelectorAll('.hajj-reveal');
    if (!reveals) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Guide Hajj 4 Écoles Juridiques : Hanafite, Malikite, Shafiite, Hanbalite</title>
        <meta name="description" content="Guide complet du Hajj selon les 4 écoles sunnites. Étapes détaillées, obligations, points de divergence entre Hanafite, Malikite, Shafiite et Hanbalite. FAQ pratiques." />
        <meta name="keywords" content="hajj, guide hajj, 4 écoles juridiques, hanafite, malikite, shafiite, hanbalite, pèlerinage, islam, fiqh, madhab, omra" />
        <link rel="canonical" href="https://omrabonsplans.fr/guide-hajj-4-ecoles" />
        <meta property="og:title" content="Guide Hajj selon les 4 Écoles Juridiques | OmraBonsPlans" />
        <meta property="og:description" content="Découvrez les étapes du Hajj expliquées selon les 4 madhabs sunnites. Obligations, divergences et FAQ détaillées." />
        <meta property="og:url" content="https://omrabonsplans.fr/guide-hajj-4-ecoles" />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Guide Hajj 4 Écoles Juridiques | OmraBonsPlans" />
        <meta name="twitter:description" content="Guide complet du Hajj selon les 4 écoles sunnites : étapes, obligations, divergences et FAQ." />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap" rel="stylesheet" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Guide Complet du Hajj selon les 4 Écoles Juridiques",
          "description": "Guide détaillé du Hajj selon les 4 madhabs sunnites : Hanafite, Malikite, Shafiite et Hanbalite.",
          "url": "https://omrabonsplans.fr/guide-hajj-4-ecoles",
          "publisher": { "@type": "Organization", "name": "OmraBonsPlans", "url": "https://omrabonsplans.fr" },
          "mainEntityOfPage": { "@type": "WebPage", "@id": "https://omrabonsplans.fr/guide-hajj-4-ecoles" }
        })}</script>
      </Helmet>

      <div ref={pageRef} className="hajj-guide-page">
        {/* HERO */}
        {/* TOP NAV BAR */}
        <nav
          aria-label="Navigation retour"
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            padding: '0.625rem 1rem',
            backgroundColor: 'hsl(35, 30%, 96%)',
            borderBottom: '1px solid hsl(35, 25%, 85%)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Link
            to="/"
            aria-label="Retour à l'accueil"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: 'hsl(25, 35%, 25%)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <ArrowLeft size={18} />
            <span>Retour</span>
          </Link>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'hsl(35, 25%, 90%)',
                color: 'hsl(25, 35%, 25%)',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              <Home size={15} />
              <span>Accueil</span>
            </Link>
            <Link
              to="/blog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.75rem',
                borderRadius: '999px',
                backgroundColor: 'hsl(40, 60%, 55%)',
                color: 'white',
                textDecoration: 'none',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              <BookOpen size={15} />
              <span>Blog</span>
            </Link>
          </div>
        </nav>

        <section className="hajj-hero">
          <div className="hajj-hero-bg" />
          <div className="hajj-hero-pattern" />
          <div className="hajj-hero-kaaba">🕋</div>
          <div className="hajj-hero-content">
            <div className="hajj-hero-badge">Guide Complet · Fiqh du Hajj</div>
            <div className="hajj-hero-arabic">دليل الحج الشامل</div>
            <h1>Le Hajj selon les <em>Quatre Écoles</em></h1>
            <p className="hajj-hero-subtitle">Guide étape par étape · Questions & Réponses · Points de divergence · Avis des madhabs</p>
            <div className="hajj-schools-preview">
              <span className="hajj-school-pill hanafi">🔵 Hanafite</span>
              <span className="hajj-school-pill maliki">🟢 Malikite</span>
              <span className="hajj-school-pill shafii">🟠 Shafiite</span>
              <span className="hajj-school-pill hanbali">🟣 Hanbalite</span>
            </div>
          </div>
          <div className="hajj-scroll-indicator"><span></span></div>
        </section>

        {/* INTRO */}
        <section id="intro" className="hajj-intro-section">
          <div className="hajj-container">
            <div className="hajj-section-number">Introduction</div>
            <h2 className="hajj-section-title">Le 5e pilier de l'<em>Islam</em></h2>
            <p className="hajj-intro-text">
              Le Hajj est l'un des cinq piliers fondamentaux de l'Islam, obligatoire une fois dans la vie pour tout musulman libre, adulte, sain d'esprit et en ayant la capacité physique et financière. Si les rites du Hajj sont largement unifiés, les <strong>quatre grandes écoles juridiques sunnites</strong> (madhabs) divergent sur de nombreux points de détail, d'obligations et de recommandations. Ce guide vous présente chaque étape avec les avis de chaque école, vous permettant de pratiquer votre Hajj en connaissance de cause.
            </p>
            <div className="hajj-hadith-box">
              <div className="hajj-hadith-arabic">وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا</div>
              <p className="hajj-hadith-text">« Et c'est un droit dû à Allah par les hommes d'accomplir le pèlerinage à la Maison, pour ceux qui peuvent s'y rendre. »</p>
              <p className="hajj-hadith-source">Sourate Âl 'Imrân (3:97)</p>
            </div>
            <p className="hajj-intro-text">
              Le Hajj se déroule chaque année au mois de <strong>Dhul Hijja</strong>, le douzième mois du calendrier lunaire islamique, entre le 8 et le 13 Dhul Hijja. Les pèlerins affluent à La Mecque depuis les quatre coins du monde pour accomplir ensemble ce rite millénaire.
            </p>
          </div>
        </section>

        {/* SCHOOLS LEGEND */}
        <section id="ecoles" className="hajj-schools-legend">
          <div className="hajj-container-wide">
            <div className="hajj-section-number">Les Madhabs</div>
            <h2 className="hajj-section-title">Les Quatre <em>Écoles Juridiques</em></h2>
            <div className="hajj-schools-grid">
              {[
                { cls: 'hanafi', name: 'École Hanafite', founder: "Fondée par l'Imam Abou Hanifa (699–767)", desc: "La plus répandue géographiquement : Turquie, Asie centrale, Pakistan, Bangladesh, Inde, Égypte. Réputée pour son recours à la ra'y (opinion rationnelle) et la flexibilité de ses positions. Environ 45% des musulmans sunnites." },
                { cls: 'maliki', name: 'École Malikite', founder: "Fondée par l'Imam Mâlik ibn Anas (711–795)", desc: "Dominante en Afrique du Nord, Afrique de l'Ouest, Soudan. S'appuie fortement sur la pratique des habitants de Médine et sur l'intérêt général (maslaha). Environ 25% des musulmans sunnites." },
                { cls: 'shafii', name: 'École Shafiite', founder: "Fondée par l'Imam Muhammad al-Shafi'i (767–820)", desc: "Présente en Égypte, Syrie, Asie du Sud-Est (Indonésie, Malaisie), Somalie. Accorde une importance primordiale au hadith et établit la méthodologie usul al-fiqh. Environ 15% des musulmans sunnites." },
                { cls: 'hanbali', name: 'École Hanbalite', founder: "Fondée par l'Imam Ahmad ibn Hanbal (780–855)", desc: "Dominante en Arabie Saoudite, Qatar, certaines régions du Golfe. La plus stricte dans l'adhésion littérale aux textes, refusant l'analogie sauf nécessité absolue. Environ 5% des musulmans sunnites." },
              ].map(s => (
                <div key={s.cls} className={`hajj-school-card ${s.cls}`}>
                  <div className="hajj-school-dot" />
                  <h3>{s.name}</h3>
                  <div className="hajj-school-founder">{s.founder}</div>
                  <p className="hajj-school-desc">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OBLIGATIONS */}
        <section id="obligations" className="hajj-obligations-section">
          <div className="hajj-container-wide">
            <div className="hajj-section-number">Fondements</div>
            <h2 className="hajj-section-title">Les <em>Obligations</em> du Hajj</h2>
            <p className="hajj-intro-text" style={{ maxWidth: 650, marginBottom: '1rem' }}>
              Les obligations se divisent en <strong>arkân</strong> (piliers incontournables) et <strong>wâjibât</strong> (obligations dont l'omission est rattrapable par une kaffarah). Les points suivants font consensus ou divergence selon les écoles.
            </p>
            <div className="hajj-obligations-grid">
              {[
                { icon: '🕋', title: "L'Ihrâm", arabic: 'الإحرام', desc: "L'état de sacralisation, déclenché par la niyya (intention) et le talbiya depuis le mîqât. Pilier unanimement reconnu. Sa rupture invalide le Hajj." },
                { icon: '🏔️', title: "La Station d'Arafat", arabic: 'الوقوف بعرفة', desc: "Rester à Arafat le 9 Dhul Hijja (du Zawâl au coucher de soleil au minimum). Pilier absolu. Le Prophète ﷺ a dit : « Le Hajj c'est Arafat »." },
                { icon: '🌑', title: "La Station à Muzdalifa", arabic: 'المبيت بمزدلفة', desc: "Passer la nuit à Muzdalifa après Arafat. Les écoles divergent sur son statut (pilier ou obligation). Les Hanafites en font un wâjib, les autres madhabs aussi." },
                { icon: '🌀', title: "Le Tawâf al-Ifâda", arabic: 'طواف الإفاضة', desc: "Les 7 tours de la Kaaba effectués après le retour d'Arafat. Pilier fondamental du Hajj, unanimement reconnu." },
                { icon: '🚶', title: "Le Sa'y", arabic: 'السعي بين الصفا والمروة', desc: "Faire 7 fois l'aller-retour entre Safa et Marwa. Les Hanafites et Malikites considèrent que son omission nécessite une fidya; Shafiites et Hanbalites en font un pilier." },
                { icon: '🗿', title: "Le Lapidement (Ramy)", arabic: 'الرمي', desc: "Lancer des galets sur les trois Jamarât à Mina. Obligation (wâjib) pour toutes les écoles. Son omission entraîne une kaffarah." },
                { icon: '🐑', title: "Le Sacrifice (Hadyi)", arabic: 'الهدي', desc: "Obligatoire pour celui qui fait le Hajj al-Qirân ou al-Tamattu'. Facultatif pour le Hajj al-Ifrâd." },
                { icon: '✂️', title: "La Tonte/Coupe (Halq ou Taqsîr)", arabic: 'الحلق أو التقصير', desc: "Se raser la tête (halq, préférable pour les hommes) ou se couper les cheveux (taqsir). Pour les femmes, couper une mèche." },
                { icon: '🌙', title: "Le Séjour à Mina (nuits)", arabic: 'المبيت بمنى', desc: "Passer les nuits du 11, 12 (et 13 pour ceux qui restent) à Mina. Obligation (wâjib) selon la majorité des écoles." },
                { icon: '🔄', title: "Le Tawâf al-Wadâ", arabic: 'طواف الوداع', desc: "Le tour de départ avant de quitter La Mecque. Wâjib pour les Hanafites, Shafiites et Hanbalites. Les Malikites le considèrent sunnah confirmée." },
              ].map((o, i) => (
                <div key={i} className="hajj-obligation-card">
                  <div className="hajj-ob-icon">{o.icon}</div>
                  <div className="hajj-ob-title">{o.title}</div>
                  <div className="hajj-ob-arabic">{o.arabic}</div>
                  <p className="hajj-ob-desc">{o.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TYPES DE HAJJ */}
        <section id="types" className="hajj-types-section">
          <div className="hajj-container">
            <div className="hajj-section-number">Forme du Hajj</div>
            <h2 className="hajj-section-title">Les Trois <em>Types de Hajj</em></h2>
            <p style={{ color: 'hsl(25, 15%, 55%)', fontSize: '1.05rem', marginBottom: '0.5rem' }}>
              Avant d'entrer en ihrâm, chaque pèlerin doit choisir l'un des trois types de Hajj. Ce choix détermine les rites à accomplir et les éventuels sacrifices requis.
            </p>
            <div className="hajj-types-grid">
              {/* Tamattu */}
              <div className="hajj-type-card recommended">
                <div className="hajj-recommended-badge">⭐ Recommandé par la majorité</div>
                <div className="hajj-type-name">التمتع</div>
                <div className="hajj-type-name-fr">Hajj al-Tamattu'</div>
                <p className="hajj-type-desc">Le pèlerin effectue d'abord la 'Umra en ihrâm, puis en sort (se tond/coupe les cheveux), et ré-entre en ihrâm pour le Hajj à partir du 8 Dhul Hijja. Nécessite un sacrifice (hadyi).</p>
                <div className="hajj-schools-opinion">
                  <div className="hajj-schools-opinion-title">Avis des Écoles</div>
                  {[
                    { school: 'hanafi', color: schoolColors.hanafi, text: "Permis, mais al-Qirân est préférable selon eux" },
                    { school: 'maliki', color: schoolColors.maliki, text: "Al-Ifrâd supérieur, mais al-Tamattu' valide" },
                    { school: 'shafii', color: schoolColors.shafii, text: "Recommande al-Tamattu', le meilleur pour les non-résidents" },
                    { school: 'hanbali', color: schoolColors.hanbali, text: "Préfère al-Tamattu', en accord avec le Prophète ﷺ" },
                  ].map(v => (
                    <div key={v.school} className="hajj-school-vote">
                      <span className="hajj-vote-dot" style={{ background: v.color }} />
                      <span><strong style={{ color: v.color }}>{v.school.charAt(0).toUpperCase() + v.school.slice(1)} :</strong> {v.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Qiran */}
              <div className="hajj-type-card">
                <div className="hajj-type-name">القِران</div>
                <div className="hajj-type-name-fr">Hajj al-Qirân</div>
                <p className="hajj-type-desc">Le pèlerin entre en ihrâm pour la 'Umra et le Hajj simultanément, sans sortir de l'ihrâm entre les deux. Nécessite un sacrifice.</p>
                <div className="hajj-schools-opinion">
                  <div className="hajj-schools-opinion-title">Avis des Écoles</div>
                  {[
                    { school: 'hanafi', color: schoolColors.hanafi, text: "Le meilleur type selon cette école" },
                    { school: 'maliki', color: schoolColors.maliki, text: "Valide, inférieur à al-Ifrâd" },
                    { school: 'shafii', color: schoolColors.shafii, text: "Moins recommandé pour les non-mecquois" },
                    { school: 'hanbali', color: schoolColors.hanbali, text: "Valide, mais inférieur à al-Tamattu'" },
                  ].map(v => (
                    <div key={v.school} className="hajj-school-vote">
                      <span className="hajj-vote-dot" style={{ background: v.color }} />
                      <span><strong style={{ color: v.color }}>{v.school.charAt(0).toUpperCase() + v.school.slice(1)} :</strong> {v.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Ifrad */}
              <div className="hajj-type-card">
                <div className="hajj-type-name">الإفراد</div>
                <div className="hajj-type-name-fr">Hajj al-Ifrâd</div>
                <p className="hajj-type-desc">Le pèlerin effectue le Hajj seul, sans 'Umra combinée. Aucun sacrifice obligatoire. La forme la plus simple.</p>
                <div className="hajj-schools-opinion">
                  <div className="hajj-schools-opinion-title">Avis des Écoles</div>
                  {[
                    { school: 'hanafi', color: schoolColors.hanafi, text: "Valide mais inférieur à al-Qirân" },
                    { school: 'maliki', color: schoolColors.maliki, text: "Le meilleur type selon cette école" },
                    { school: 'shafii', color: schoolColors.shafii, text: "Moins recommandé, al-Tamattu' est préféré" },
                    { school: 'hanbali', color: schoolColors.hanbali, text: "Valide, mais al-Tamattu' reste préférable" },
                  ].map(v => (
                    <div key={v.school} className="hajj-school-vote">
                      <span className="hajj-vote-dot" style={{ background: v.color }} />
                      <span><strong style={{ color: v.color }}>{v.school.charAt(0).toUpperCase() + v.school.slice(1)} :</strong> {v.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="hajj-note-box" style={{ marginTop: '2rem' }}>
              <strong>🏆 Synthèse :</strong> La majorité des savants (Shafiites, Hanbalites, et beaucoup d'autres) recommandent <strong>al-Tamattu'</strong> pour les pèlerins venant de loin, car c'est ce que le Prophète Muhammad ﷺ a ordonné à ses compagnons lors du Hajj de l'An 10 de l'Hégire. Les Hanafites préfèrent al-Qirân, et les Malikites al-Ifrâd.
            </div>
          </div>
        </section>

        {/* ÉTAPES DU HAJJ */}
        <section id="rites" className="hajj-steps-section">
          <div className="hajj-container">
            <div className="hajj-section-number">Le Guide</div>
            <h2 className="hajj-section-title">Étape par Étape : <em>Les Rites du Hajj</em></h2>
            <p style={{ color: 'hsl(25, 15%, 55%)', fontSize: '1.05rem', marginBottom: '3rem' }}>Suivez chaque étape du Hajj avec les positions détaillées des quatre madhabs.</p>

            {/* Étape 1 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">1</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">الإحرام من الميقات</div>
                <h2>L'Ihrâm depuis le Mîqât</h2>
                <p className="hajj-step-desc">Avant de franchir les limites sacrées (mîqât), le pèlerin entre en état d'ihrâm. Pour les hommes : deux pièces de tissu blanc non cousues. Pour les femmes : leurs habits normaux couvrant tout le corps (sauf visage et mains). On prononce la niyya et le Talbiya : <em>« Labbayk Allâhumma labbayk… »</em></p>
                <CompareTable rows={[
                  ["La niyya seule suffit à l'entrée en ihrâm ; le talbiya est wâjib (obligation) à prononcer immédiatement",
                   "L'ihrâm est validé par la niyya + talbiya. La ghusl avant l'ihrâm est sunnah fortement recommandée",
                   "L'ihrâm requiert niyya + talbiya ou tout autre dhikr. Le talbiya peut être dit à voix haute par les hommes",
                   "La niyya + talbiya sont tous deux piliers de l'ihrâm. Omettre la talbiya nécessite une kaffarah selon certains"]
                ]} />
                <div className="hajj-note-box" style={{ marginTop: '1rem' }}>
                  <strong>📍 Les Mîqât :</strong> Dhul Hulayfah (Médine) · Juhfah (Syrie/Maroc) · Qarn al-Manâzil (Najd) · Yalamlam (Yémen) · Dhât 'Irq (Irak). Celui qui les franchit sans ihrâm doit revenir ou payer une kaffarah selon la majorité.
                </div>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">2</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">طواف القدوم</div>
                <h2>Le Tawâf al-Qudûm (Arrivée)</h2>
                <p className="hajj-step-desc">À l'arrivée à La Mecque, le pèlerin effectue 7 tours de la Kaaba dans le sens antihoraire, en commençant par la Pierre Noire. Les 3 premiers tours à pas rapides (raml) pour les hommes, puis 4 tours normaux.</p>
                <CompareTable rows={[
                  ["Sunnah pour le Hajj al-Qirân et al-Ifrâd. Non requis pour al-Tamattu'",
                   "Sunnah confirmée pour tous. Son omission ne nécessite pas de kaffarah",
                   "Sunnah pour al-Ifrâd et al-Qirân. Omis dans al-Tamattu' (la 'Umra le remplace)",
                   "Sunnah. Son omission sans excuse est déconseillée mais n'invalide pas le Hajj"]
                ]} />
              </div>
            </div>

            {/* Étape 3 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">3</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">السعي بين الصفا والمروة</div>
                <h2>Le Sa'y entre Safa et Marwa</h2>
                <p className="hajj-step-desc">7 allers-retours entre les collines de Safa et Marwa, en commençant par Safa. Commémore la course de Hâjar à la recherche d'eau pour son fils Ismaïl.</p>
                <CompareTable rows={[
                  ["<strong>Wâjib</strong> (obligation). Son omission nécessite une fidya (sacrifice), mais le Hajj reste valide",
                   "<strong>Rukn</strong> (pilier) selon l'opinion la plus forte. Son omission invalide la 'Umra ou le Hajj",
                   "<strong>Rukn</strong> (pilier) absolument. Sans sa'y, ni la 'Umra ni le Hajj ne sont valides",
                   "<strong>Wâjib</strong> indispensable. Son abandon délibéré invalide le Hajj selon la position principale"]
                ]} />
              </div>
            </div>

            {/* Étape 4 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">4</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">يوم التروية — ٨ ذو الحجة</div>
                <h2>Le 8 Dhul Hijja — Départ vers Mina</h2>
                <p className="hajj-step-desc">Le 8 Dhul Hijja (Yawm al-Tarwiya), le pèlerin entre en ihrâm et se rend à Mina, à environ 5 km de La Mecque. Il y passe la journée et la nuit en priant et récitant le dhikr.</p>
                <div className="hajj-note-box">
                  <strong>Statut du séjour à Mina le 8 :</strong> Sunnah confirmée selon tous les madhabs. Son omission n'entraîne aucune kaffarah mais est une perte spirituelle.
                </div>
              </div>
            </div>

            {/* Étape 5 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">5</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">الوقوف بعرفة — ٩ ذو الحجة</div>
                <h2>La Station d'Arafat — 9 Dhul Hijja</h2>
                <p className="hajj-step-desc">C'est le cœur du Hajj. Le pèlerin doit être présent sur la plaine d'Arafat. Le Prophète ﷺ a dit : « Le Hajj c'est Arafat ».</p>
                <CompareTable rows={[
                  ["Wuqûf du Zawâl jusqu'au coucher du soleil = wâjib. Présence nocturne jusqu'au Fajr du 10 est wâjib aussi",
                   "Il suffit d'être présent un instant entre Zawâl du 9 et aube du 10. Rester jusqu'après le coucher est sunnah",
                   "Présence entre Zawâl du 9 et aube du 10 = rukn. S'en aller avant le coucher sans revenir nécessite une kaffarah",
                   "Présence un instant entre Zawâl du 9 et aube du 10 = rukn. Mieux de rester jusqu'au coucher puis partir à Muzdalifa"],
                  ["Prières Dhuhr et Asr regroupées à Zawâl (comme le Prophète ﷺ)",
                   "Regroupement des prières à Arafat : sunnah suivie",
                   "Regroupement Dhuhr/Asr en avançant à Arafat = sunnah",
                   "Regroupement des prières : fortement recommandé comme le Prophète ﷺ"]
                ]} />
              </div>
            </div>

            {/* Étape 6 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">6</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">المبيت بمزدلفة</div>
                <h2>La Nuit à Muzdalifa</h2>
                <p className="hajj-step-desc">Après le coucher du soleil, départ d'Arafat vers Muzdalifa. Le pèlerin y prie Maghrib et Isha (regroupées et raccourcies), passe la nuit, ramasse des galets pour le lendemain et prie Fajr.</p>
                <CompareTable rows={[
                  ["Séjour wâjib. Doit y arriver avant l'aube et y prier Fajr pour éviter une kaffarah",
                   "Séjour wâjib selon l'opinion dominante. La présence un instant après minuit suffit",
                   "Séjour wâjib. La présence un instant après minuit suffit. Les malades/femmes peuvent partir plus tôt",
                   "Séjour wâjib. Doit y rester jusqu'après Fajr. Départ avant l'aube nécessite un dam (sacrifice)"]
                ]} />
              </div>
            </div>

            {/* Étape 7 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">7</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">يوم النحر — ١٠ ذو الحجة</div>
                <h2>Le 10 Dhul Hijja — Yawm al-Nahr</h2>
                <p className="hajj-step-desc">Le jour de l'Aïd al-Adha. Quatre actes majeurs : <strong>(1) Lapidation de Jamarat al-Aqaba · (2) Sacrifice (hadyi) · (3) Tonte/Coupe · (4) Tawâf al-Ifâda + Sa'y</strong>.</p>
                <CompareTable rows={[
                  ["L'ordre est sunnah, pas obligatoire. Le Tawâf al-Ifâda peut être retardé jusqu'à fin Dhul Hijja",
                   "L'ordre recommandé est observé. Le Tawâf al-Ifâda peut être fait jusqu'à la fin de Dhul Hijja",
                   "L'ordre est recommandé. Le Tawâf al-Ifâda doit être fait avant la fin de Dhul Hijja (sinon kaffarah)",
                   "L'ordre est sunnah. Le Tawâf al-Ifâda est idéalement le 10, peut être retardé avec dam"]
                ]} />
              </div>
            </div>

            {/* Étape 8 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">8</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">أيام التشريق — ١١، ١٢، ١٣ ذو الحجة</div>
                <h2>Les Jours de Tashrîq (11, 12, 13 Dhul Hijja)</h2>
                <p className="hajj-step-desc">Retour à Mina. Le pèlerin lapide chaque jour les trois Jamarât après le Zawâl, 7 galets chacune. Il passe les nuits à Mina. Celui qui veut peut partir après le 12 (Nafr al-Awwal).</p>
                <CompareTable rows={[
                  ["Lapidation possible avant Zawâl le 12 et 13. Nuits à Mina = wâjib. Départ le 12 permis",
                   "Lapidation après Zawâl = wâjib. Nuits à Mina = wâjib. Départ avant coucher du 12 permis",
                   "Lapidation strictement après Zawâl. Nuits à Mina = wâjib. Départ le 12 avant coucher permis",
                   "Lapidation après Zawâl = wâjib. Rester le 13 préférable (sunnah). Départ le 12 permis"]
                ]} />
              </div>
            </div>

            {/* Étape 9 */}
            <div className="hajj-step-block hajj-reveal">
              <div className="hajj-step-number-wrap"><div className="hajj-step-num">9</div></div>
              <div className="hajj-step-content">
                <div className="hajj-step-arabic">طواف الوداع</div>
                <h2>Le Tawâf al-Wadâ' — Adieu à La Mecque</h2>
                <p className="hajj-step-desc">Avant de quitter La Mecque, le pèlerin effectue un dernier tawâf autour de la Kaaba. C'est l'adieu à la Maison Sacrée.</p>
                <CompareTable rows={[
                  ["<strong>Wâjib.</strong> Son omission nécessite un dam (sacrifice). Exemption pour les femmes en période de menstruation",
                   "<strong>Sunnah confirmée</strong> (muakkada). Son omission n'entraîne pas de kaffarah mais est fortement déconseillée",
                   "<strong>Wâjib.</strong> Omission = dam. Exemption pour les femmes en menstruation ou nifas",
                   "<strong>Wâjib.</strong> Omission = dam. Exemption pour les femmes impures selon Ibn Qudama"]
                ]} />
              </div>
            </div>
          </div>
        </section>

        {/* VÊTEMENTS IHRAM */}
        <section id="ihram" className="hajj-ihram-section">
          <div className="hajj-container-wide">
            <div className="hajj-section-number">Dress Code Sacré</div>
            <h2 className="hajj-section-title">Les Vêtements de l'<em>Ihrâm</em></h2>
            <p style={{ color: 'hsl(25, 15%, 55%)', fontSize: '1.05rem', maxWidth: 650, marginBottom: '2rem' }}>
              L'ihrâm impose des règles vestimentaires strictes. La question des vêtements cousus est l'un des sujets sur lesquels les quatre écoles ont des positions nuancées.
            </p>
            <div className="hajj-ihram-grid">
              <div className="hajj-ihram-panel">
                <h3>👨 Pour les Hommes</h3>
                {[
                  { icon: '◆', text: "Porter deux pièces de tissu blanc non cousu : le ridâ' (haut) et l'izâr (bas)" },
                  { icon: '◆', text: "Tête à découvert obligatoire (pas de bonnet, chapeau, capuche)" },
                  { icon: '◆', text: "Sandales ouvertes (nu'al) qui ne couvrent pas les chevilles ni les orteils" },
                  { icon: '✗', text: "Interdit : chemises, pantalons, chaussettes, sous-vêtements, gants" },
                ].map((r, i) => (
                  <div key={i} className="hajj-ihram-rule">
                    <span className="hajj-ihram-rule-icon">{r.icon}</span>
                    <span>{r.text}</span>
                  </div>
                ))}
                <div className="hajj-school-note">
                  <strong style={{ color: schoolColors.hanafi }}>🔵 Hanafite :</strong> Un tissu non cousu attaché avec une épingle est permis par nécessité. Les Malikites et Shafiites sont plus stricts. Les Hanbalites permettent l'utilisation de ceintures ou d'attaches.
                </div>
              </div>
              <div className="hajj-ihram-panel">
                <h3>👩 Pour les Femmes</h3>
                {[
                  { icon: '◆', text: "Porter des vêtements normaux (abaya, jilbab) couvrant tout le corps sauf le visage et les mains" },
                  { icon: '◆', text: "Le visage doit rester découvert en état d'ihrâm (sauf en présence d'hommes étrangers)" },
                  { icon: '◆', text: "Les mains à découvert (pas de gants)" },
                  { icon: '◆', text: "Les vêtements cousus sont parfaitement permis pour les femmes" },
                ].map((r, i) => (
                  <div key={i} className="hajj-ihram-rule">
                    <span className="hajj-ihram-rule-icon">{r.icon}</span>
                    <span>{r.text}</span>
                  </div>
                ))}
                <div className="hajj-school-note">
                  <strong>Divergence :</strong> <span style={{ color: schoolColors.hanafi }}>Hanafites</span> — les femmes doivent garder le visage découvert mais peuvent utiliser un écran devant les hommes. <span style={{ color: schoolColors.maliki }}>Malikites</span> — le visage peut être couvert si nécessaire. <span style={{ color: schoolColors.shafii }}>Shafiites et Hanbalites</span> — le visage doit rester découvert mais peut être abaissé sans contact.
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ fontFamily: 'inherit', fontSize: '1.5rem', color: 'inherit', marginBottom: '1rem' }}>❓ Les vêtements cousus : ce que dit chaque école</h3>
              <CompareTable rows={[
                ["Interdit de porter tout vêtement cousu qui épouse la forme du corps (makhit). Cela inclut les sous-vêtements et les chaussettes",
                 "Interdit de porter tout vêtement confectionné pour le corps (comme une chemise). Le terme utilisé est « malfûq » (assemblé)",
                 "Interdit tout ce qui est cousu et ajusté à une partie du corps. Le critère est l'ajustement, pas le fait d'être cousu",
                 "Interdit tout ce qui est cousu pour le corps humain. La kaffarah pour port de vêtement cousu = sacrifice ou aumône ou jeûne"],
                ["La kaffarah est : sacrifice d'un mouton, ou 3 jours de jeûne, ou nourrir 6 pauvres",
                 "La kaffarah est : sacrifice, ou 3 jours de jeûne, ou aumône à 6 pauvres (une mudd chacun)",
                 "Même kaffarah. Un tissu cousu sur les côtés (non ajusté) peut être permis selon certains savants",
                 "Même kaffarah. Ibn Qudama précise que même une ceinture cousue portée à la taille est permise"]
              ]} />
            </div>
          </div>
        </section>

        {/* DIVERGENCES */}
        <section id="divergences" className="hajj-divergences-section">
          <div className="hajj-container">
            <div className="hajj-section-number">⚡ Section Clé</div>
            <h2 className="hajj-section-title">Les <em>Points de Divergence</em> Majeurs<br />entre les Quatre Écoles</h2>
            <p className="hajj-divergences-intro">Ces divergences sont au cœur du fiqh du Hajj. Les connaître vous permettra de pratiquer votre Hajj avec lucidité et d'éviter les erreurs selon votre madhab.</p>

            <DivergenceCard icon="🧭" title="1. Le Mîqât — Le franchissement sans ihrâm">
              <DgSchool school="hanafi" label="Hanafite">Doit revenir au mîqât depuis La Mecque. S'il ne le fait pas, il doit payer un dam (sacrifice).</DgSchool>
              <DgSchool school="maliki" label="Malikite">Revenir au mîqât est obligatoire. Sans retour, le dam est obligatoire. S'il revient depuis n'importe quel point, le dam tombe.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Revenir au mîqât avant d'entrer en ihrâm = obligatoire. Sans retour, un dam est nécessaire. Le Hajj reste valide mais défectueux.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Même position que les Shafiites. Le retour au mîqât annule la faute. Sans retour, un dam compense l'irrégularité.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🌅" title="2. Le Moment du départ d'Arafat">
              <DgSchool school="hanafi" label="Hanafite">Partir avant le coucher du soleil est makrûh (déconseillé). Si le pèlerin part sans revenir, un dam est obligatoire.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Partir avant le coucher est autorisé selon la majorité des Malikites.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Partir avant le coucher sans revenir nécessite un dam.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Partir avant le coucher est makrûh. Un dam est nécessaire si on ne revient pas.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🕐" title="3. Le Moment autorisé pour la lapidation">
              <DgSchool school="hanafi" label="Hanafite">Le 10 : dès l'aube après Muzdalifa. Les jours suivants : après Zawâl jusqu'au coucher.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Le 10 : dès le lever du soleil. Les jours suivants : après Zawâl strictement.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Le 10 : dès le lever du soleil. Les jours de tashrîq : après Zawâl.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Le 10 : dès l'aube. Les jours de tashrîq : après Zawâl.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="✂️" title="4. Halq ou Taqsîr — Rasage ou coupe des cheveux">
              <DgSchool school="hanafi" label="Hanafite">Le halq (rasage) est wâjib pour les hommes. Le taqsîr est permis mais insuffisant sans excuse.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Halq et taqsîr sont tous deux permis, avec une préférence pour le halq.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Le halq ou taqsîr est un rukn (pilier). Sans lui, le pèlerin ne sort pas de l'ihrâm.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Halq ou taqsîr = wâjib. Le halq est meilleur. Minimum un tiers des cheveux selon Ibn Qudama.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🌙" title="5. Le Statut du séjour nocturne à Muzdalifa">
              <DgSchool school="hanafi" label="Hanafite">Wâjib. Doit arriver avant l'aube et y prier Fajr. Sinon = dam.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Wâjib. La présence pendant la seconde moitié de la nuit est obligatoire.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Wâjib. Il suffit d'une présence un instant après minuit.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Wâjib. Doit y rester jusqu'après Fajr. Départ avant l'aube sans excuse = dam.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="💧" title="6. La Pureté rituelle (Tahâra) pour le Tawâf">
              <DgSchool school="hanafi" label="Hanafite">La pureté est wâjib pour le tawâf. Si effectué sans wudhu, le tawâf est valide mais défectueux, et nécessite un dam.</DgSchool>
              <DgSchool school="maliki" label="Malikite">La pureté est wâjib. Tawâf sans wudhu = invalide selon l'opinion dominante.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">La pureté est un shart (condition de validité). Un tawâf sans wudhu est invalide et doit être refait.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">La pureté est obligatoire pour le tawâf al-Ifâda (pilier). Son absence invalide ce tawâf.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🎯" title="7. Le Sa'y — Pilier ou Obligation simple ?">
              <DgSchool school="hanafi" label="Hanafite"><strong>Wâjib</strong> (obligation). Son omission totale = un dam. Le Hajj est valide mais défectueux.</DgSchool>
              <DgSchool school="maliki" label="Malikite"><strong>Rukn</strong> (pilier) selon l'opinion dominante. Son omission invalide le Hajj ou la 'Umra.</DgSchool>
              <DgSchool school="shafii" label="Shafiite"><strong>Rukn</strong> absolument. Aucun Hajj valide sans sa'y.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite"><strong>Wâjib</strong> selon l'opinion principale, <strong>rukn</strong> selon d'autres savants hanbalites.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🔢" title="8. Nombre minimum de galets pour la lapidation">
              <DgSchool school="hanafi" label="Hanafite">4 galets sur 7 suffisent pour que la lapidation du jour soit valide (la majorité).</DgSchool>
              <DgSchool school="maliki" label="Malikite">La majorité (4/7) suffit pour la validité. Mais chaque galet manquant entraîne une kaffarah proportionnelle.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Chaque galet compte individuellement. Omettre un seul galet entraîne une kaffarah.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Les 7 galets sont tous obligatoires. Chaque galet manquant entraîne une kaffarah.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="👶" title="9. Le Hajj pour un mineur — Obligation ou non ?">
              <DgSchool school="hanafi" label="Hanafite">Le Hajj d'un mineur est valide (nawâfil) mais ne remplace pas l'obligation du Hajj à l'âge adulte.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Même position : le Hajj d'un mineur est valide comme supérogatoire. Il ne compte pas comme le Hajj obligatoire.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Valide comme nawâfil. La wali (tuteur) prononce l'ihrâm pour le très jeune enfant.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Valide comme acte méritoire. Le tuteur peut aider l'enfant à accomplir tous les rites.</DgSchool>
            </DivergenceCard>

            <DivergenceCard icon="🤝" title="10. Le Hajj par procuration (Badal al-Hajj)">
              <DgSchool school="hanafi" label="Hanafite">Permis pour personne décédée ou malade chronique. Le mandataire doit avoir déjà effectué son propre Hajj.</DgSchool>
              <DgSchool school="maliki" label="Malikite">Permis pour le défunt qui en a fait le testament, ou la personne dans l'impossibilité permanente.</DgSchool>
              <DgSchool school="shafii" label="Shafiite">Permis pour personne décédée ou handicapée de façon permanente. Le représentant doit avoir d'abord accompli son propre Hajj.</DgSchool>
              <DgSchool school="hanbali" label="Hanbalite">Permis. Position la plus libérale : il peut aussi être accompli pour une personne vivante dans l'incapacité physique permanente.</DgSchool>
            </DivergenceCard>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="hajj-faq-section">
          <div className="hajj-container">
            <div className="hajj-section-number">Questions & Réponses</div>
            <h2 className="hajj-section-title">Les Questions <em>Fréquentes</em><br />selon les Quatre Écoles</h2>
            <p style={{ color: 'hsl(25, 15%, 55%)', fontSize: '1.05rem', marginBottom: '2.5rem' }}>Des situations courantes vécues par les pèlerins, avec les réponses détaillées de chaque madhab.</p>

            <FAQItem question="❓ Un pèlerin porte un pantalon par erreur durant quelques heures en état d'ihrâm. Que doit-il faire ?" defaultOpen>
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite">Il doit enlever le pantalon dès qu'il s'en aperçoit. La kaffarah s'applique même par erreur selon Abou Hanifa : sacrifier un mouton, ou 3 jours de jeûne, ou nourrir 6 pauvres.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite">S'il l'a porté par oubli ou ignorance, il n'y a pas de kaffarah selon l'avis le plus fort des Malikites. Dès qu'il s'en rend compte, il l'enlève.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite">S'il le portait par oubli, pas de kaffarah selon les Shafiites — c'est une des facilités de la charia. Port intentionnel = kaffarah obligatoire.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite">Même position que les Shafiites : l'oubli et l'ignorance exonèrent de la kaffarah. Le Hajj reste parfaitement valide.</SchoolAnswer>
            </FAQItem>

            <FAQItem question="❓ Une femme a ses règles lors du Tawâf al-Ifâda. Que fait-elle ?">
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite">Elle ne peut pas effectuer le Tawâf en état d'impureté. Elle doit attendre la fin de ses règles, faire la ghusl, puis accomplir le tawâf.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite">Elle doit attendre. Si l'attente est impossible, certains Malikites permettent le Tawâf avec un dam compensatoire.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite">La pureté est une condition de validité absolue. Elle doit attendre, quelle que soit la durée.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite">Elle doit attendre la purification. Une fatwa contemporaine d'Ibn 'Uthaymin permet de prendre un médicament si nécessaire.</SchoolAnswer>
            </FAQItem>

            <FAQItem question="❓ Quel est le type de Hajj le plus méritoire selon les écoles ?">
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite"><strong>Al-Qirân</strong> est le meilleur, car il combine 'Umra et Hajj dans un seul ihrâm ininterrompu.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite"><strong>Al-Ifrâd</strong> est le meilleur selon les Malikites, car il consacre le Hajj seul avec une plus grande pureté d'intention.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite"><strong>Al-Tamattu'</strong> est le meilleur pour les non-résidents, conformément à ce que le Prophète ﷺ a ordonné à ses compagnons.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite"><strong>Al-Tamattu'</strong> est le meilleur, en accord avec les hadiths authentiques du Prophète ﷺ.</SchoolAnswer>
            </FAQItem>

            <FAQItem question="❓ Peut-on utiliser des médicaments (désodorisants, crèmes) en état d'ihrâm ?">
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite">Tout produit parfumé est interdit en ihrâm. Les produits sans parfum sont permis.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite">Tout ce qui contient du parfum est interdit. Les crèmes médicales non parfumées sont permises.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite">Utiliser du parfum est un interdit de l'ihrâm. Les médicaments nécessaires non parfumés sont permis.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite">Même position. Si un médicament contient du parfum et qu'il est nécessaire médicalement, il peut être utilisé avec une kaffarah.</SchoolAnswer>
            </FAQItem>

            <FAQItem question="❓ Le pèlerin s'est endormi et a manqué la nuit de Muzdalifa. Que doit-il faire ?">
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite">S'il n'a pas du tout passé la nuit à Muzdalifa, un dam est obligatoire. Le Hajj reste valide.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite">S'il a passé la seconde moitié de la nuit hors de Muzdalifa, un dam est requis.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite">Il suffit d'avoir été présent un instant après minuit. Sinon, un dam est requis. Le Hajj reste valide.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite">Doit avoir été présent jusqu'après Fajr. Absence complète = dam obligatoire. Le Hajj reste valide.</SchoolAnswer>
            </FAQItem>

            <FAQItem question="❓ Le pèlerin peut-il se couper les ongles ou se raser la barbe en état d'ihrâm ?">
              <SchoolAnswer school="hanafi" label="🔵 École Hanafite">Couper les ongles ou les cheveux est interdit en ihrâm. Chaque ongle coupé = sadaqa. Couper 5 ongles et plus = dam complet.</SchoolAnswer>
              <SchoolAnswer school="maliki" label="🟢 École Malikite">Interdit. La kaffarah est la même que pour le port de vêtement cousu : sacrifice, jeûne ou aumône.</SchoolAnswer>
              <SchoolAnswer school="shafii" label="🟠 École Shafiite">Interdit. Couper 3 cheveux ou plus en une fois = kaffarah complète. 1 ou 2 cheveux = kaffarah réduite.</SchoolAnswer>
              <SchoolAnswer school="hanbali" label="🟣 École Hanbalite">Interdit. Couper un seul cheveu = sadaqa. Couper 3 cheveux ou plus = dam.</SchoolAnswer>
            </FAQItem>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="hajj-footer">
          <div className="hajj-container">
            <div className="hajj-footer-arabic">رَبَّنَا تَقَبَّلْ مِنَّا</div>
            <div className="hajj-gold-divider" />
            <p className="hajj-footer-text" style={{ marginBottom: '1rem' }}>« Notre Seigneur, accepte cela de notre part. » — Sourate Al-Baqara (2:127)</p>
            <p className="hajj-footer-text" style={{ fontSize: '0.75rem', marginTop: '1.5rem', color: 'hsl(25, 15%, 55%)' }}>
              Ce guide a été rédigé à titre informatif et éducatif. Pour les questions juridiques personnelles,<br />
              consultez toujours un savant ou une autorité religieuse qualifiée selon votre école.
            </p>
          </div>
        </footer>

        <MobileBottomNav />
      </div>
    </>
  );
};

export default GuideHajj4Ecoles;
