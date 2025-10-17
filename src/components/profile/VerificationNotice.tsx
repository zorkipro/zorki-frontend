import React, { useCallback } from 'react';
import { Alert, AlertDescription } from '@/ui-kit';
import { Button } from '@/ui-kit';
import { AlertCircle, ExternalLink } from 'lucide-react';

interface VerificationNoticeProps {
  profileStatus: string;
}

const ADMIN_INSTAGRAM_URL = 'https://instagram.com/zorki.pro';

export const VerificationNotice: React.FC<VerificationNoticeProps> = React.memo(
  ({ profileStatus }) => {
    const handleContactAdmin = useCallback(() => {
      window.open(ADMIN_INSTAGRAM_URL, '_blank');
    }, []);

    if (profileStatus === 'verified') return null;

    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="font-bold text-red-600 mb-2">Нужна верификация</div>
          Напишите администратору в Instagram с вашей страницы Instagram: "Я зарегистрировался на
          Zorki.pro, подтвердите мою страницу".
        </AlertDescription>
        <div className="mt-3">
          <Button
            onClick={handleContactAdmin}
            className="flex items-center space-x-2 w-full"
            size="sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Написать администратору</span>
          </Button>
        </div>
      </Alert>
    );
  }
);

VerificationNotice.displayName = 'VerificationNotice';
