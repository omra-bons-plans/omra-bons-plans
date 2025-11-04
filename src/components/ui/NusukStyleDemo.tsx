import { Calendar, Book, Hand } from 'lucide-react';

export const NusukStyleDemo = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Aperçu Thème Nusuk
          </h1>
          <p className="text-muted-foreground text-lg">
            Palette spirituelle inspirée de l'application Nusuk
          </p>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Carte Bronze - Omra */}
          <div className="card-nusuk-bronze group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Omra</h2>
                <p className="text-foreground/80">Réserver un permis</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                <span className="text-2xl">+</span>
              </div>
            </div>
          </div>

          {/* Carte Émeraude - Rawdah */}
          <div className="card-nusuk-emerald group cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">La Noble Rawdah</h2>
                <p className="text-foreground/80">Réserver un permis</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/20 transition-colors">
                <span className="text-2xl">+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grande carte coucher de soleil - Temps de prière */}
        <div className="card-nusuk-sunset">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-foreground/20 flex items-center justify-center">
                <span className="text-sm">↻</span>
              </div>
              <span className="text-foreground/90">Temara</span>
            </div>
            <p className="text-foreground/90 mb-2 text-lg">Temps de prière restant Fajr</p>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-8">10:19:40</h1>
            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-center">
              {[
                { name: 'Fajr', time: '06:25' },
                { name: 'Lever...', time: '07:50' },
                { name: 'Zuhr', time: '01:11' },
                { name: 'Asr', time: '04:09' },
                { name: 'Maghrib', time: '06:32' },
                { name: 'Isha', time: '07:52' }
              ].map((prayer) => (
                <div key={prayer.name} className="flex flex-col items-center">
                  <div className="mb-2 text-foreground/80">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <p className="text-sm text-foreground/90 font-medium">{prayer.name}</p>
                  <p className="text-foreground/80">{prayer.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Services en bas */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Des services pour enrichir votre expérience
          </h2>
          <div className="grid grid-cols-3 gap-6">
            {[
              { icon: Book, title: "Qur'an", color: 'primary' },
              { icon: Calendar, title: 'Ahadeth', color: 'primary' },
              { icon: Hand, title: "Du'a", color: 'primary' }
            ].map((service) => (
              <div key={service.title} className="flex flex-col items-center gap-3 p-6 rounded-xl bg-card hover:bg-card-elevated transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-8 h-8 text-primary" />
                </div>
                <p className="text-foreground font-medium">{service.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Palette de couleurs */}
        <div className="mt-12 p-6 bg-card rounded-xl">
          <h3 className="text-xl font-bold text-foreground mb-4">Palette de couleurs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-16 rounded bg-primary"></div>
              <p className="text-sm text-muted-foreground">Primary (Bronze/Or)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded bg-secondary"></div>
              <p className="text-sm text-muted-foreground">Secondary (Émeraude)</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded bg-accent"></div>
              <p className="text-sm text-muted-foreground">Accent</p>
            </div>
            <div className="space-y-2">
              <div className="h-16 rounded bg-muted"></div>
              <p className="text-sm text-muted-foreground">Muted</p>
            </div>
          </div>
        </div>

        {/* Note pour l'utilisateur */}
        <div className="mt-8 p-6 bg-card-elevated rounded-xl border border-primary/20">
          <p className="text-foreground/90 text-center">
            ✨ Ce thème transforme votre comparateur avec des tons spirituels inspirés de l'app Nusuk : 
            bronze/or pour la chaleur, émeraude pour la noblesse, et des dégradés de coucher de soleil.
          </p>
        </div>
      </div>
    </div>
  );
};
