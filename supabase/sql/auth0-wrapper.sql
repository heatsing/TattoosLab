-- Auth0 Wrapper setup for Supabase SQL Editor
-- Official docs:
-- https://supabase.com/docs/guides/database/extensions/wrappers/auth0
--
-- This foreign table is read-only and intended for admin / SQL inspection.
-- Keep it out of public API schemas because foreign tables do not have RLS.
--
-- Before running:
-- 1. Replace <AUTH0_MANAGEMENT_TOKEN> with a valid Auth0 Management API bearer token
--    or another long-lived credential supported by the Auth0 Wrapper.
-- 2. Replace <AUTH0_USERS_ENDPOINT> with your Management API users endpoint, e.g.
--    https://dev-tenant.us.auth0.com/api/v2/users
-- 3. Run the create_secret statement once, copy the returned key_id, and replace
--    <AUTH0_VAULT_KEY_ID> below.

create extension if not exists wrappers with schema extensions;
create extension if not exists supabase_vault with schema vault;

do $$
begin
  if not exists (
    select 1
    from pg_foreign_data_wrapper
    where fdwname = 'auth0_wrapper'
  ) then
    create foreign data wrapper auth0_wrapper
      handler auth0_fdw_handler
      validator auth0_fdw_validator;
  end if;
end
$$;

-- Run this once and copy the returned key_id.
select vault.create_secret(
  '<AUTH0_MANAGEMENT_TOKEN>',
  'auth0_management_token',
  'Bearer token used by the Supabase Auth0 Wrapper'
);

do $$
begin
  if not exists (
    select 1
    from pg_foreign_server
    where srvname = 'auth0_server'
  ) then
    create server auth0_server
      foreign data wrapper auth0_wrapper
      options (
        url '<AUTH0_USERS_ENDPOINT>',
        api_key_id '<AUTH0_VAULT_KEY_ID>'
      );
  else
    alter server auth0_server
      options (
        set url '<AUTH0_USERS_ENDPOINT>',
        set api_key_id '<AUTH0_VAULT_KEY_ID>'
      );
  end if;
end
$$;

create schema if not exists auth0;

drop foreign table if exists auth0.auth0_users;

create foreign table auth0.auth0_users (
  user_id text,
  email text,
  email_verified boolean,
  name text,
  nickname text,
  given_name text,
  family_name text,
  picture text,
  last_login text,
  created_at text,
  updated_at text,
  blocked boolean,
  identities jsonb
)
server auth0_server
options (
  object 'users'
);

comment on foreign table auth0.auth0_users is
  'Read-only Auth0 users foreign table powered by the Supabase Auth0 Wrapper.';

revoke all on schema auth0 from public, anon, authenticated;
revoke all on foreign table auth0.auth0_users from public, anon, authenticated;

grant usage on schema auth0 to postgres, service_role;
grant select on auth0.auth0_users to postgres, service_role;
