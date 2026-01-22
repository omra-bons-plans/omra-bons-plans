import Bell from 'lucide-react/dist/esm/icons/bell';
import Check from 'lucide-react/dist/esm/icons/check';
import CheckCheck from 'lucide-react/dist/esm/icons/check-check';
import Eye from 'lucide-react/dist/esm/icons/eye';
import MessageSquare from 'lucide-react/dist/esm/icons/message-square';
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle';
import Settings from 'lucide-react/dist/esm/icons/settings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications, Notification } from '@/hooks/useNotifications';

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'profile_view':
      return <Eye className="h-4 w-4" />;
    case 'ad_comment':
      return <MessageSquare className="h-4 w-4" />;
    case 'contact_request':
      return <MessageSquare className="h-4 w-4" />;
    case 'ad_status_change':
      return <Settings className="h-4 w-4" />;
    case 'ad_expiring':
      return <AlertTriangle className="h-4 w-4" />;
    case 'system':
      return <Bell className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'profile_view':
      return 'text-blue-500';
    case 'ad_comment':
      return 'text-green-500';
    case 'contact_request':
      return 'text-purple-500';
    case 'ad_status_change':
      return 'text-orange-500';
    case 'ad_expiring':
      return 'text-red-500';
    case 'system':
      return 'text-gray-500';
    default:
      return 'text-gray-500';
  }
};

interface NotificationCenterProps {
  className?: string;
}

export const NotificationCenter = ({ className }: NotificationCenterProps) => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      markAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse">Chargement...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Tout marquer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2" />
              <p>Aucune notification</p>
            </div>
          ) : (
            <div className="space-y-1">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div
                    className={`
                      p-4 cursor-pointer transition-colors hover:bg-muted/50
                      ${!notification.is_read ? 'bg-primary/5 border-l-4 border-l-primary' : ''}
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">
                            {notification.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDistance(new Date(notification.created_at), new Date(), { 
                                addSuffix: true,
                                locale: fr 
                              })}
                            </span>
                            {notification.is_read && (
                              <Check className="h-3 w-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};