

## Diagnostic : Suppression de compte utilisateur impossible

### Cause du problème

Le code dans `src/pages/Admin.tsx` (ligne 355) utilise :

```typescript
await supabase.auth.admin.deleteUser(userId);
```

L'API `auth.admin` nécessite un token **service_role**, mais le client Supabase côté navigateur utilise la clé **anon** (publique). Les logs d'authentification confirment l'erreur :

> "this token needs to have one of the following roles: supabase_admin, service_role"

**On ne peut jamais appeler `auth.admin.*` depuis le navigateur** car la clé service_role ne doit jamais être exposée côté client.

### Solution

Créer une **Edge Function** `delete-user` qui :
1. Vérifie que l'appelant est authentifié et a le rôle `admin` (via `has_role()`)
2. Utilise le client Supabase avec la clé `SERVICE_ROLE_KEY` pour appeler `auth.admin.deleteUser()`
3. Retourne le résultat

Puis modifier `handleDeleteUser` dans `Admin.tsx` pour appeler cette Edge Function au lieu de `supabase.auth.admin.deleteUser()` directement.

### Fichiers à modifier/créer

1. **Créer** `supabase/functions/delete-user/index.ts` — Edge Function sécurisée qui supprime un utilisateur via l'API admin avec le service_role_key
2. **Modifier** `src/pages/Admin.tsx` — Remplacer l'appel `supabase.auth.admin.deleteUser()` par un appel à la nouvelle Edge Function

### Détails techniques

L'Edge Function :
- Extrait le JWT de l'appelant pour vérifier qu'il est admin
- Crée un client Supabase admin avec `SUPABASE_SERVICE_ROLE_KEY` (déjà configuré dans les secrets)
- Appelle `auth.admin.deleteUser(userId)` côté serveur
- Renvoie une réponse appropriée

