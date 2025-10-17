// ============================================
// Social Media Linking Component
// ============================================
// Компонент для связывания социальных сетей с блогером
// Используется пользователями для запроса связывания аккаунтов
// ============================================

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Alert,
  AlertDescription,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/ui-kit';
import { MessageSquare, Youtube, Instagram, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSocialLinking } from '@/hooks/useSocialLinking';

interface SocialLinkingProps {
  bloggerId: number;
  className?: string;
}

export const SocialLinking: React.FC<SocialLinkingProps> = ({ bloggerId, className }) => {
  const { loading, error, linkTgChannel, linkYtChannel, linkIgUser, clearError } =
    useSocialLinking();

  const [tgChannel, setTgChannel] = useState('');
  const [ytChannel, setYtChannel] = useState('');
  const [igUsername, setIgUsername] = useState('');

  const handleTgLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tgChannel) {
      return;
    }

    try {
      await linkTgChannel(bloggerId, {
        channelName: tgChannel.trim(),
      });

      setTgChannel('');
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleYtLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ytChannel) {
      return;
    }

    try {
      await linkYtChannel(bloggerId, {
        channelName: ytChannel.trim(),
      });

      setYtChannel('');
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  const handleIgLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!igUsername) {
      return;
    }

    try {
      await linkIgUser(bloggerId, {
        username: igUsername.trim(),
      });

      setIgUsername('');
    } catch (error) {
      // Ошибка обрабатывается в хуке
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Связать социальные сети</CardTitle>
        <CardDescription>
          Запросить связывание ваших социальных аккаунтов с профилем блогера
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Ошибка */}
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="telegram" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="telegram" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Telegram</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center space-x-2">
              <Youtube className="w-4 h-4" />
              <span>YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center space-x-2">
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </TabsTrigger>
          </TabsList>

          {/* Telegram */}
          <TabsContent value="telegram" className="space-y-4">
            <form onSubmit={handleTgLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tgChannel">Название канала</Label>
                <Input
                  id="tgChannel"
                  type="text"
                  placeholder="@channel_name"
                  value={tgChannel}
                  onChange={(e) => setTgChannel(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading || !tgChannel}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Отправка запроса...
                  </>
                ) : (
                  'Связать Telegram канал'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* YouTube */}
          <TabsContent value="youtube" className="space-y-4">
            <form onSubmit={handleYtLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ytChannel">Название канала</Label>
                <Input
                  id="ytChannel"
                  type="text"
                  placeholder="Channel Name"
                  value={ytChannel}
                  onChange={(e) => setYtChannel(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading || !ytChannel}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Отправка запроса...
                  </>
                ) : (
                  'Связать YouTube канал'
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Instagram */}
          <TabsContent value="instagram" className="space-y-4">
            <form onSubmit={handleIgLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="igUsername">Имя пользователя</Label>
                <Input
                  id="igUsername"
                  type="text"
                  placeholder="username"
                  value={igUsername}
                  onChange={(e) => setIgUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              <Button type="submit" disabled={loading || !igUsername}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Отправка запроса...
                  </>
                ) : (
                  'Связать Instagram аккаунт'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            После отправки запроса администратор рассмотрит его и свяжет ваш аккаунт с профилем
            блогера.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
