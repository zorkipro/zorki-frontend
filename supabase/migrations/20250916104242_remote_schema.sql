drop extension if exists "pg_net";

revoke delete on table "public"."admin_actions" from "anon";

revoke insert on table "public"."admin_actions" from "anon";

revoke references on table "public"."admin_actions" from "anon";

revoke select on table "public"."admin_actions" from "anon";

revoke trigger on table "public"."admin_actions" from "anon";

revoke truncate on table "public"."admin_actions" from "anon";

revoke update on table "public"."admin_actions" from "anon";

revoke delete on table "public"."admin_actions" from "authenticated";

revoke insert on table "public"."admin_actions" from "authenticated";

revoke references on table "public"."admin_actions" from "authenticated";

revoke select on table "public"."admin_actions" from "authenticated";

revoke trigger on table "public"."admin_actions" from "authenticated";

revoke truncate on table "public"."admin_actions" from "authenticated";

revoke update on table "public"."admin_actions" from "authenticated";

revoke delete on table "public"."admin_actions" from "service_role";

revoke insert on table "public"."admin_actions" from "service_role";

revoke references on table "public"."admin_actions" from "service_role";

revoke select on table "public"."admin_actions" from "service_role";

revoke trigger on table "public"."admin_actions" from "service_role";

revoke truncate on table "public"."admin_actions" from "service_role";

revoke update on table "public"."admin_actions" from "service_role";

revoke delete on table "public"."banned_topics" from "anon";

revoke insert on table "public"."banned_topics" from "anon";

revoke references on table "public"."banned_topics" from "anon";

revoke select on table "public"."banned_topics" from "anon";

revoke trigger on table "public"."banned_topics" from "anon";

revoke truncate on table "public"."banned_topics" from "anon";

revoke update on table "public"."banned_topics" from "anon";

revoke delete on table "public"."banned_topics" from "authenticated";

revoke insert on table "public"."banned_topics" from "authenticated";

revoke references on table "public"."banned_topics" from "authenticated";

revoke select on table "public"."banned_topics" from "authenticated";

revoke trigger on table "public"."banned_topics" from "authenticated";

revoke truncate on table "public"."banned_topics" from "authenticated";

revoke update on table "public"."banned_topics" from "authenticated";

revoke delete on table "public"."banned_topics" from "service_role";

revoke insert on table "public"."banned_topics" from "service_role";

revoke references on table "public"."banned_topics" from "service_role";

revoke select on table "public"."banned_topics" from "service_role";

revoke trigger on table "public"."banned_topics" from "service_role";

revoke truncate on table "public"."banned_topics" from "service_role";

revoke update on table "public"."banned_topics" from "service_role";

revoke delete on table "public"."influencer_banned_topics" from "anon";

revoke insert on table "public"."influencer_banned_topics" from "anon";

revoke references on table "public"."influencer_banned_topics" from "anon";

revoke select on table "public"."influencer_banned_topics" from "anon";

revoke trigger on table "public"."influencer_banned_topics" from "anon";

revoke truncate on table "public"."influencer_banned_topics" from "anon";

revoke update on table "public"."influencer_banned_topics" from "anon";

revoke delete on table "public"."influencer_banned_topics" from "authenticated";

revoke insert on table "public"."influencer_banned_topics" from "authenticated";

revoke references on table "public"."influencer_banned_topics" from "authenticated";

revoke select on table "public"."influencer_banned_topics" from "authenticated";

revoke trigger on table "public"."influencer_banned_topics" from "authenticated";

revoke truncate on table "public"."influencer_banned_topics" from "authenticated";

revoke update on table "public"."influencer_banned_topics" from "authenticated";

revoke delete on table "public"."influencer_banned_topics" from "service_role";

revoke insert on table "public"."influencer_banned_topics" from "service_role";

revoke references on table "public"."influencer_banned_topics" from "service_role";

revoke select on table "public"."influencer_banned_topics" from "service_role";

revoke trigger on table "public"."influencer_banned_topics" from "service_role";

revoke truncate on table "public"."influencer_banned_topics" from "service_role";

revoke update on table "public"."influencer_banned_topics" from "service_role";

revoke delete on table "public"."influencer_platform_stats" from "anon";

revoke insert on table "public"."influencer_platform_stats" from "anon";

revoke references on table "public"."influencer_platform_stats" from "anon";

revoke select on table "public"."influencer_platform_stats" from "anon";

revoke trigger on table "public"."influencer_platform_stats" from "anon";

revoke truncate on table "public"."influencer_platform_stats" from "anon";

revoke update on table "public"."influencer_platform_stats" from "anon";

revoke delete on table "public"."influencer_platform_stats" from "authenticated";

revoke insert on table "public"."influencer_platform_stats" from "authenticated";

revoke references on table "public"."influencer_platform_stats" from "authenticated";

revoke select on table "public"."influencer_platform_stats" from "authenticated";

revoke trigger on table "public"."influencer_platform_stats" from "authenticated";

revoke truncate on table "public"."influencer_platform_stats" from "authenticated";

revoke update on table "public"."influencer_platform_stats" from "authenticated";

revoke delete on table "public"."influencer_platform_stats" from "service_role";

revoke insert on table "public"."influencer_platform_stats" from "service_role";

revoke references on table "public"."influencer_platform_stats" from "service_role";

revoke select on table "public"."influencer_platform_stats" from "service_role";

revoke trigger on table "public"."influencer_platform_stats" from "service_role";

revoke truncate on table "public"."influencer_platform_stats" from "service_role";

revoke update on table "public"."influencer_platform_stats" from "service_role";

revoke delete on table "public"."influencer_profiles" from "anon";

revoke insert on table "public"."influencer_profiles" from "anon";

revoke references on table "public"."influencer_profiles" from "anon";

revoke select on table "public"."influencer_profiles" from "anon";

revoke trigger on table "public"."influencer_profiles" from "anon";

revoke truncate on table "public"."influencer_profiles" from "anon";

revoke update on table "public"."influencer_profiles" from "anon";

revoke delete on table "public"."influencer_profiles" from "authenticated";

revoke insert on table "public"."influencer_profiles" from "authenticated";

revoke references on table "public"."influencer_profiles" from "authenticated";

revoke select on table "public"."influencer_profiles" from "authenticated";

revoke trigger on table "public"."influencer_profiles" from "authenticated";

revoke truncate on table "public"."influencer_profiles" from "authenticated";

revoke update on table "public"."influencer_profiles" from "authenticated";

revoke delete on table "public"."influencer_profiles" from "service_role";

revoke insert on table "public"."influencer_profiles" from "service_role";

revoke references on table "public"."influencer_profiles" from "service_role";

revoke select on table "public"."influencer_profiles" from "service_role";

revoke trigger on table "public"."influencer_profiles" from "service_role";

revoke truncate on table "public"."influencer_profiles" from "service_role";

revoke update on table "public"."influencer_profiles" from "service_role";

revoke delete on table "public"."influencer_topics" from "anon";

revoke insert on table "public"."influencer_topics" from "anon";

revoke references on table "public"."influencer_topics" from "anon";

revoke select on table "public"."influencer_topics" from "anon";

revoke trigger on table "public"."influencer_topics" from "anon";

revoke truncate on table "public"."influencer_topics" from "anon";

revoke update on table "public"."influencer_topics" from "anon";

revoke delete on table "public"."influencer_topics" from "authenticated";

revoke insert on table "public"."influencer_topics" from "authenticated";

revoke references on table "public"."influencer_topics" from "authenticated";

revoke select on table "public"."influencer_topics" from "authenticated";

revoke trigger on table "public"."influencer_topics" from "authenticated";

revoke truncate on table "public"."influencer_topics" from "authenticated";

revoke update on table "public"."influencer_topics" from "authenticated";

revoke delete on table "public"."influencer_topics" from "service_role";

revoke insert on table "public"."influencer_topics" from "service_role";

revoke references on table "public"."influencer_topics" from "service_role";

revoke select on table "public"."influencer_topics" from "service_role";

revoke trigger on table "public"."influencer_topics" from "service_role";

revoke truncate on table "public"."influencer_topics" from "service_role";

revoke update on table "public"."influencer_topics" from "service_role";

revoke delete on table "public"."influencers" from "anon";

revoke insert on table "public"."influencers" from "anon";

revoke references on table "public"."influencers" from "anon";

revoke select on table "public"."influencers" from "anon";

revoke trigger on table "public"."influencers" from "anon";

revoke truncate on table "public"."influencers" from "anon";

revoke update on table "public"."influencers" from "anon";

revoke delete on table "public"."influencers" from "authenticated";

revoke insert on table "public"."influencers" from "authenticated";

revoke references on table "public"."influencers" from "authenticated";

revoke select on table "public"."influencers" from "authenticated";

revoke trigger on table "public"."influencers" from "authenticated";

revoke truncate on table "public"."influencers" from "authenticated";

revoke update on table "public"."influencers" from "authenticated";

revoke delete on table "public"."influencers" from "service_role";

revoke insert on table "public"."influencers" from "service_role";

revoke references on table "public"."influencers" from "service_role";

revoke select on table "public"."influencers" from "service_role";

revoke trigger on table "public"."influencers" from "service_role";

revoke truncate on table "public"."influencers" from "service_role";

revoke update on table "public"."influencers" from "service_role";

revoke delete on table "public"."platform_screenshots" from "anon";

revoke insert on table "public"."platform_screenshots" from "anon";

revoke references on table "public"."platform_screenshots" from "anon";

revoke select on table "public"."platform_screenshots" from "anon";

revoke trigger on table "public"."platform_screenshots" from "anon";

revoke truncate on table "public"."platform_screenshots" from "anon";

revoke update on table "public"."platform_screenshots" from "anon";

revoke delete on table "public"."platform_screenshots" from "authenticated";

revoke insert on table "public"."platform_screenshots" from "authenticated";

revoke references on table "public"."platform_screenshots" from "authenticated";

revoke select on table "public"."platform_screenshots" from "authenticated";

revoke trigger on table "public"."platform_screenshots" from "authenticated";

revoke truncate on table "public"."platform_screenshots" from "authenticated";

revoke update on table "public"."platform_screenshots" from "authenticated";

revoke delete on table "public"."platform_screenshots" from "service_role";

revoke insert on table "public"."platform_screenshots" from "service_role";

revoke references on table "public"."platform_screenshots" from "service_role";

revoke select on table "public"."platform_screenshots" from "service_role";

revoke trigger on table "public"."platform_screenshots" from "service_role";

revoke truncate on table "public"."platform_screenshots" from "service_role";

revoke update on table "public"."platform_screenshots" from "service_role";

revoke delete on table "public"."platforms" from "anon";

revoke insert on table "public"."platforms" from "anon";

revoke references on table "public"."platforms" from "anon";

revoke select on table "public"."platforms" from "anon";

revoke trigger on table "public"."platforms" from "anon";

revoke truncate on table "public"."platforms" from "anon";

revoke update on table "public"."platforms" from "anon";

revoke delete on table "public"."platforms" from "authenticated";

revoke insert on table "public"."platforms" from "authenticated";

revoke references on table "public"."platforms" from "authenticated";

revoke select on table "public"."platforms" from "authenticated";

revoke trigger on table "public"."platforms" from "authenticated";

revoke truncate on table "public"."platforms" from "authenticated";

revoke update on table "public"."platforms" from "authenticated";

revoke delete on table "public"."platforms" from "service_role";

revoke insert on table "public"."platforms" from "service_role";

revoke references on table "public"."platforms" from "service_role";

revoke select on table "public"."platforms" from "service_role";

revoke trigger on table "public"."platforms" from "service_role";

revoke truncate on table "public"."platforms" from "service_role";

revoke update on table "public"."platforms" from "service_role";

revoke delete on table "public"."profile_edits" from "anon";

revoke insert on table "public"."profile_edits" from "anon";

revoke references on table "public"."profile_edits" from "anon";

revoke select on table "public"."profile_edits" from "anon";

revoke trigger on table "public"."profile_edits" from "anon";

revoke truncate on table "public"."profile_edits" from "anon";

revoke update on table "public"."profile_edits" from "anon";

revoke delete on table "public"."profile_edits" from "authenticated";

revoke insert on table "public"."profile_edits" from "authenticated";

revoke references on table "public"."profile_edits" from "authenticated";

revoke select on table "public"."profile_edits" from "authenticated";

revoke trigger on table "public"."profile_edits" from "authenticated";

revoke truncate on table "public"."profile_edits" from "authenticated";

revoke update on table "public"."profile_edits" from "authenticated";

revoke delete on table "public"."profile_edits" from "service_role";

revoke insert on table "public"."profile_edits" from "service_role";

revoke references on table "public"."profile_edits" from "service_role";

revoke select on table "public"."profile_edits" from "service_role";

revoke trigger on table "public"."profile_edits" from "service_role";

revoke truncate on table "public"."profile_edits" from "service_role";

revoke update on table "public"."profile_edits" from "service_role";

revoke delete on table "public"."profiles" from "anon";

revoke insert on table "public"."profiles" from "anon";

revoke references on table "public"."profiles" from "anon";

revoke select on table "public"."profiles" from "anon";

revoke trigger on table "public"."profiles" from "anon";

revoke truncate on table "public"."profiles" from "anon";

revoke update on table "public"."profiles" from "anon";

revoke delete on table "public"."profiles" from "authenticated";

revoke insert on table "public"."profiles" from "authenticated";

revoke references on table "public"."profiles" from "authenticated";

revoke select on table "public"."profiles" from "authenticated";

revoke trigger on table "public"."profiles" from "authenticated";

revoke truncate on table "public"."profiles" from "authenticated";

revoke update on table "public"."profiles" from "authenticated";

revoke delete on table "public"."profiles" from "service_role";

revoke insert on table "public"."profiles" from "service_role";

revoke references on table "public"."profiles" from "service_role";

revoke select on table "public"."profiles" from "service_role";

revoke trigger on table "public"."profiles" from "service_role";

revoke truncate on table "public"."profiles" from "service_role";

revoke update on table "public"."profiles" from "service_role";

revoke delete on table "public"."topics" from "anon";

revoke insert on table "public"."topics" from "anon";

revoke references on table "public"."topics" from "anon";

revoke select on table "public"."topics" from "anon";

revoke trigger on table "public"."topics" from "anon";

revoke truncate on table "public"."topics" from "anon";

revoke update on table "public"."topics" from "anon";

revoke delete on table "public"."topics" from "authenticated";

revoke insert on table "public"."topics" from "authenticated";

revoke references on table "public"."topics" from "authenticated";

revoke select on table "public"."topics" from "authenticated";

revoke trigger on table "public"."topics" from "authenticated";

revoke truncate on table "public"."topics" from "authenticated";

revoke update on table "public"."topics" from "authenticated";

revoke delete on table "public"."topics" from "service_role";

revoke insert on table "public"."topics" from "service_role";

revoke references on table "public"."topics" from "service_role";

revoke select on table "public"."topics" from "service_role";

revoke trigger on table "public"."topics" from "service_role";

revoke truncate on table "public"."topics" from "service_role";

revoke update on table "public"."topics" from "service_role";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name')
  );
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;


