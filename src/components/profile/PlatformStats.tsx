import React from 'react';
import { Card, CardContent } from '@/ui-kit';
import { Button } from '@/ui-kit';
import { Input } from '@/ui-kit';
import { Label } from '@/ui-kit';
import { EditableCard } from '@/ui-kit';
import { Users, TrendingUp, Eye, Wallet } from 'lucide-react';
import { PlatformStats, EditData } from '@/types/profile';

interface PlatformStatsProps {
  stats: PlatformStats;
  formData: EditData;
  editingSection: string | null;
  saving: boolean;
  onEditingChange: (section: string | null) => void;
  onSave: (data: Partial<EditData>) => void;
  formatNumber: (num: number) => string;
}

export const InstagramStats: React.FC<PlatformStatsProps> = ({
  stats,
  formData,
  editingSection,
  saving,
  onEditingChange,
  onSave,
  formatNumber,
}) => {

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Подписчики - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.subscribers)}
          </div>
          <div className="text-sm text-muted-foreground">Подписчиков</div>
        </CardContent>
      </Card>

      {/* ER - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold text-success">{stats.er}%</div>
          <div className="text-sm text-muted-foreground">ER</div>
        </CardContent>
      </Card>

      {/* Охват публикаций - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Eye className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{formatNumber(stats.reach)}</div>
          <div className="text-sm text-muted-foreground">Охват публикаций</div>
        </CardContent>
      </Card>

      {/* Охват сторис - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Охват сторис"
        icon={<Eye className="w-6 h-6 text-warning mx-auto mb-2" />}
        value={stats.storyReach}
        editKey="instagram_story_reach"
        isEditing={editingSection === 'instagram_story_reach'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-foreground">
              {formatNumber(stats.storyReach)}
            </div>
            <div className="text-sm text-muted-foreground">Охват сторис</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_story_reach">Охват сторис</Label>
              <Input
                id="instagram_story_reach"
                type="number"
                defaultValue={formData.instagram_story_reach}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById(
                    'instagram_story_reach'
                  ) as HTMLInputElement;
                  try {
                    await onSave({ instagram_story_reach: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />

      {/* Цена публикации - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Цена публикации"
        icon={<Wallet className="w-6 h-6 text-primary mx-auto mb-2" />}
        value={stats.price}
        editKey="instagram_post_price"
        isEditing={editingSection === 'instagram_post_price'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-primary">{stats.price || 0} BYN</div>
            <div className="text-sm text-muted-foreground">Цена публикации</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_post_price">Цена за пост (BYN)</Label>
              <Input
                id="instagram_post_price"
                type="number"
                defaultValue={formData.instagram_post_price}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById('instagram_post_price') as HTMLInputElement;
                  try {
                    await onSave({ instagram_post_price: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />

      {/* Цена сторис - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Цена сторис"
        icon={<Wallet className="w-6 h-6 text-primary mx-auto mb-2" />}
        value={stats.storyPrice}
        editKey="instagram_story_price"
        isEditing={editingSection === 'instagram_story_price'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-primary">{stats.storyPrice || 0} BYN</div>
            <div className="text-sm text-muted-foreground">Цена сторис</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="instagram_story_price">Цена за сторис (BYN)</Label>
              <Input
                id="instagram_story_price"
                type="number"
                defaultValue={formData.instagram_story_price}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById(
                    'instagram_story_price'
                  ) as HTMLInputElement;
                  try {
                    await onSave({ instagram_story_price: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const TikTokStats: React.FC<PlatformStatsProps> = ({
  stats,
  formData,
  editingSection,
  saving,
  onEditingChange,
  onSave,
  formatNumber,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Подписчики - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.subscribers)}
          </div>
          <div className="text-sm text-muted-foreground">Подписчиков</div>
        </CardContent>
      </Card>

      {/* Охват - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Eye className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.reach || stats.subscribers * 0.4)}
          </div>
          <div className="text-sm text-muted-foreground">Охват</div>
        </CardContent>
      </Card>

      {/* Цена публикации - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Цена публикации"
        icon={<Wallet className="w-6 h-6 text-primary mx-auto mb-2" />}
        value={stats.price}
        editKey="tiktok_post_price"
        isEditing={editingSection === 'tiktok_post_price'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-primary">{stats.price || 0} BYN</div>
            <div className="text-sm text-muted-foreground">Цена публикации</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tiktok_post_price">Цена за публикацию (BYN)</Label>
              <Input
                id="tiktok_post_price"
                type="number"
                defaultValue={formData.tiktok_post_price || stats.price || ''}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById('tiktok_post_price') as HTMLInputElement;
                  try {
                    await onSave({ tiktok_post_price: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const TelegramStats: React.FC<PlatformStatsProps> = ({
  stats,
  formData,
  editingSection,
  saving,
  onEditingChange,
  onSave,
  formatNumber,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Подписчики - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.subscribers)}
          </div>
          <div className="text-sm text-muted-foreground">Подписчиков</div>
        </CardContent>
      </Card>

      {/* Охват - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Eye className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.reach || stats.subscribers * 0.6)}
          </div>
          <div className="text-sm text-muted-foreground">Охват</div>
        </CardContent>
      </Card>

      {/* Цена публикации - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Цена публикации"
        icon={<Wallet className="w-6 h-6 text-primary mx-auto mb-2" />}
        value={stats.price}
        editKey="telegram_post_price"
        isEditing={editingSection === 'telegram_post_price'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-primary">{stats.price || 0} BYN</div>
            <div className="text-sm text-muted-foreground">Цена публикации</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="telegram_post_price">Цена за публикацию (BYN)</Label>
              <Input
                id="telegram_post_price"
                type="number"
                defaultValue={formData.telegram_post_price || stats.price || ''}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById('telegram_post_price') as HTMLInputElement;
                  try {
                    await onSave({ telegram_post_price: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};

export const YouTubeStats: React.FC<PlatformStatsProps> = ({
  stats,
  formData,
  editingSection,
  saving,
  onEditingChange,
  onSave,
  formatNumber,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      {/* Подписчики - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(stats.subscribers)}
          </div>
          <div className="text-sm text-muted-foreground">Подписчиков</div>
        </CardContent>
      </Card>

      {/* Просмотры - НЕ редактируемое */}
      <Card>
        <CardContent className="p-4 text-center">
          <Eye className="w-6 h-6 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold text-foreground">{formatNumber(stats.views || 0)}</div>
          <div className="text-sm text-muted-foreground">Просмотров</div>
        </CardContent>
      </Card>

      {/* Цена интеграции - РЕДАКТИРУЕМОЕ */}
      <EditableCard
        title="Цена интеграции"
        icon={<Wallet className="w-6 h-6 text-primary mx-auto mb-2" />}
        value={stats.price}
        editKey="youtube_post_price"
        isEditing={editingSection === 'youtube_post_price'}
        onEditChange={onEditingChange}
        renderContent={() => (
          <>
            <div className="text-2xl font-bold text-primary">{stats.price || 0} BYN</div>
            <div className="text-sm text-muted-foreground">Цена интеграции</div>
          </>
        )}
        renderEditForm={() => (
          <div className="space-y-4">
            <div>
              <Label htmlFor="youtube_post_price">Цена за интеграцию (BYN)</Label>
              <Input
                id="youtube_post_price"
                type="number"
                defaultValue={formData.youtube_post_price || stats.price || ''}
                placeholder="0"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onEditingChange(null)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  const input = document.getElementById('youtube_post_price') as HTMLInputElement;
                  try {
                    await onSave({ youtube_post_price: input.value });
                    onEditingChange(null);
                  } catch (error) {
                    // Ошибка при сохранении
                  }
                }}
                disabled={saving}
              >
                Сохранить
              </Button>
            </div>
          </div>
        )}
      />
    </div>
  );
};
