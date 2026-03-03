

## Diagnostic : "Mot de passe oublié" ne fonctionne pas

### Problèmes identifiés

**1. Aucun email de réinitialisation n'est envoyé**
Les logs d'authentification ne montrent aucune requête `/recover` — l'email de reset n'a jamais été envoyé ou a été bloqué silencieusement.

**2. Domaine de production absent des URLs de redirection autorisées**
Dans la configuration Supabase (`config.toml` et probablement le dashboard), seul le domaine Lovable preview est autorisé :
```
site_url = "https://0d32be0f-...lovableproject.com"
additional_redirect_urls = ["https://0d32be0f-...lovableproject.com", "...lovableproject.com/auth"]
```
Or l'utilisateur est sur `https://omrabonsplans.fr`. Le `redirectTo` dans le code utilise `window.location.origin` → `https://omrabonsplans.fr/auth`, qui n'est pas dans la liste autorisée. **Supabase rejette silencieusement les redirections vers des domaines non autorisés.**

**3. Possible conflit avec le hook `send-reset-password-email`**
L'edge function `send-reset-password-email` existe mais n'a aucun log — soit le hook n'est pas configuré dans le dashboard Supabase, soit il intercepte la requête et échoue silencieusement.

### Plan de correction

**Étape 1 — Ajouter le domaine de production aux URLs autorisées (action manuelle dans le dashboard Supabase)**
- Aller dans **Authentication > URL Configuration** du dashboard Supabase
- Ajouter `https://omrabonsplans.fr/**` aux **Redirect URLs**
- Idéalement, mettre le **Site URL** à `https://omrabonsplans.fr`

**Étape 2 — Vérifier le hook email dans le dashboard**
- Aller dans **Authentication > Hooks** dans le dashboard Supabase
- Vérifier si un hook "Send Email" est configuré pour pointer vers `send-reset-password-email`
- Si le hook est configuré mais ne fonctionne pas : soit le corriger, soit le désactiver pour utiliser les emails par défaut de Supabase

**Étape 3 — Mettre à jour `config.toml` avec le domaine de production**
- Ajouter `https://omrabonsplans.fr` et `https://omrabonsplans.fr/**` dans `additional_redirect_urls`

### Ce que je peux faire maintenant
- Mettre à jour le `supabase/config.toml` pour inclure le domaine de production
- Le reste (dashboard Supabase : Site URL, Redirect URLs, vérification du hook) nécessite votre intervention manuelle dans le dashboard

