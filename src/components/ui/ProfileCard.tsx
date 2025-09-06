import { User, Building, Star, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

interface ProfileCardProps {
  profile: {
    id: string;
    slug?: string;
    full_name?: string;
    first_name?: string;
    kuniya?: string;
    company_name?: string;
    is_professional?: boolean;
    profile_image?: string;
    bio?: string;
    profile_views?: number;
    experience_years?: number;
    specialties?: string[];
  };
  adsCount: number;
  compact?: boolean;
}

const ProfileCard = ({ profile, adsCount, compact = false }: ProfileCardProps) => {
  const navigate = useNavigate();

  const getDisplayName = () => {
    if (profile.is_professional && profile.company_name) {
      return profile.company_name;
    }
    
    if (profile.kuniya) {
      return profile.kuniya;
    }
    
    return profile.full_name || profile.first_name || 'Utilisateur';
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleViewProfile = () => {
    if (profile.slug) {
      navigate(`/profile/${profile.slug}`);
    }
  };

  if (compact) {
    return (
      <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewProfile}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={profile.profile_image} alt={getDisplayName()} />
              <AvatarFallback className="text-sm font-bold">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{getDisplayName()}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{adsCount} annonces</span>
                {profile.profile_views && (
                  <>
                    <span>•</span>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      {profile.profile_views} vues
                    </div>
                  </>
                )}
              </div>
            </div>
            {profile.is_professional && (
              <Badge variant="secondary" className="shrink-0">
                <Building className="w-3 h-3 mr-1" />
                Pro
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Profil du prestataire</CardTitle>
          {profile.is_professional && (
            <Badge variant="secondary">
              <Building className="w-3 h-3 mr-1" />
              Professionnel
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src={profile.profile_image} alt={getDisplayName()} />
            <AvatarFallback className="text-lg font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-2">{getDisplayName()}</h3>
            {profile.bio && (
              <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                {profile.bio}
              </p>
            )}
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {adsCount} annonce{adsCount > 1 ? 's' : ''}
              </div>
              {profile.profile_views && (
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {profile.profile_views} vues
                </div>
              )}
              {profile.experience_years && (
                <div className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {profile.experience_years} ans d'expérience
                </div>
              )}
            </div>
          </div>
        </div>

        {profile.specialties && profile.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {profile.specialties.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{profile.specialties.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Button
          onClick={handleViewProfile}
          variant="outline"
          className="w-full"
          disabled={!profile.slug}
        >
          <User className="w-4 h-4 mr-2" />
          Voir le profil complet
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;