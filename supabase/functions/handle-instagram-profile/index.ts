import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InstagramProfileRequest {
  username: string;
  userId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Function started');

    const { username, userId }: InstagramProfileRequest = await req.json();
    console.log(`Processing username: ${username}, userId: ${userId}`);

    // Проверяем, что userId валидный UUID
    if (!userId || typeof userId !== 'string') {
      return new Response(
        JSON.stringify({
          error: 'Неверный userId',
          type: 'validation_error',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    console.log('Environment check:', {
      supabaseUrl: supabaseUrl ? 'SET' : 'NOT SET',
      supabaseServiceKey: supabaseServiceKey ? 'SET' : 'NOT SET',
    });

    console.log('Creating Supabase client...');

    // Создаем клиент с service role key для обхода RLS
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('Supabase client created');

    // Используем SQL функцию для создания профиля
    console.log('Creating profile using SQL function...');

    try {
      // Вызываем SQL функцию для создания профиля
      const { data: result, error: functionError } = await supabase.rpc(
        'create_instagram_profile',
        {
          p_username: username,
          p_user_id: userId,
        }
      );

      if (functionError) {
        console.error('Profile creation function failed:', functionError);
        throw functionError;
      }

      console.log('Profile created successfully via function:', result);

      // Пытаемся связать профиль с существующими данными блогера
      console.log('Attempting to link profile to existing blogger data...');
      const { data: linkResult, error: linkError } = await supabase.rpc('link_profile_to_blogger', {
        p_user_id: userId,
        p_username: username,
      });

      if (linkError) {
        console.warn('Failed to link profile to blogger data:', linkError);
      } else {
        console.log('Profile linking result:', linkResult);
      }

      // Проверяем результат привязки
      if (linkResult && !linkResult.success) {
        if (linkResult.error === 'blogger_already_verified') {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'blogger_already_verified',
              message: linkResult.message,
            }),
            {
              status: 409, // Conflict
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }

        if (linkResult.error === 'blogger_not_found') {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'blogger_not_found',
              message: linkResult.message,
            }),
            {
              status: 404, // Not Found
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          profile: {
            id: result.profile_id,
            platform: 'instagram',
            username: result.username,
            user_id: result.user_id,
            status: linkResult?.success ? 'verified' : 'unverified',
            source: 'manual',
            followers_count: 0,
            avg_reels_views: 0,
            public_visible: linkResult?.success || false,
            was_rebound: linkResult?.was_rebound || false,
          },
          message: linkResult?.success
            ? linkResult.was_rebound
              ? 'Profile created and rebound to existing blogger data'
              : 'Profile created and linked to existing blogger data'
            : 'Profile created successfully',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    } catch (sqlError) {
      console.error('SQL function operation failed:', sqlError);
      throw sqlError;
    }
  } catch (error: unknown) {
    console.error('Error in handle-instagram-profile function:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
        type: 'server_error',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

serve(handler);
