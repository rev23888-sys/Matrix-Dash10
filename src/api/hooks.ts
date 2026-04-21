import { CustomFeatures, CustomGuildInfo }   from '../config/types';
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { UserInfo, getGuild, getGuilds, fetchUserInfo } from '@/api/discord';
import {
  disableFeature, enableFeature, fetchGuildChannels,
  fetchGuildInfo, fetchGuildRoles, getFeature, updateFeature,
} from '@/api/bot';
import { GuildInfo }       from '@/config/types';
import { useAccessToken, useSession } from '@/utils/auth/hooks';

export const client = new QueryClient({
  defaultOptions: {
    mutations: { retry: 0 },
    queries: {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 0,
    },
  },
});

export const Keys = {
  login:        ['login'],
  guilds:       ['user_guilds'],
  guild:        (id: string)                     => ['guild', id],
  guild_info:   (guild: string)                  => ['guild_info', guild],
  features:     (guild: string, feature: string) => ['feature', guild, feature],
  guildRoles:   (guild: string)                  => ['guild_roles', guild],
  guildChannels:(guild: string)                  => ['guild_channels', guild],
  leaderboard:  (guild: string, type: string)    => ['leaderboard', guild, type],
};

export function useGuild(id: string) {
  const accessToken = useAccessToken();
  return useQuery(Keys.guild(id), () => getGuild(accessToken as string, id), {
    enabled: accessToken != null,
  });
}

export function useGuilds() {
  const accessToken = useAccessToken();
  return useQuery(Keys.guilds, () => getGuilds(accessToken as string), {
    enabled: accessToken != null,
    // Refresh guild list every 60s so newly added servers appear
    staleTime: 60_000,
  });
}

export function useSelfUserQuery() {
  const accessToken = useAccessToken();
  return useQuery<UserInfo>(
    ['users', 'me'],
    () => fetchUserInfo(accessToken!!),
    { enabled: accessToken != null, staleTime: Infinity }
  );
}

export function useGuildInfoQuery(guild: string) {
  const { status, session } = useSession();
  return useQuery<CustomGuildInfo | null>(
    Keys.guild_info(guild),
    () => fetchGuildInfo(session!!, guild),
    {
      enabled: status === 'authenticated',
      // Always re-check — this is how we detect if bot is present
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: false,
      staleTime: 30_000,   // re-check every 30s
    }
  );
}

export function useFeatureQuery<K extends keyof CustomFeatures>(guild: string, feature: K) {
  const { status, session } = useSession();
  return useQuery(
    Keys.features(guild, feature),
    () => getFeature(session!!, guild, feature),
    { enabled: status === 'authenticated', staleTime: 30_000 }
  );
}

export type EnableFeatureOptions = { guild: string; feature: string; enabled: boolean };
export function useEnableFeatureMutation() {
  const { session } = useSession();
  return useMutation(
    async ({ enabled, guild, feature }: EnableFeatureOptions) => {
      if (enabled) return enableFeature(session!!, guild, feature);
      return disableFeature(session!!, guild, feature);
    },
    {
      async onSuccess(_, { guild, feature, enabled }) {
        await client.invalidateQueries(Keys.features(guild, feature));
        client.setQueryData<GuildInfo | null>(Keys.guild_info(guild), prev => {
          if (prev == null) return null;
          return {
            ...prev,
            enabledFeatures: enabled
              ? prev.enabledFeatures.includes(feature) ? prev.enabledFeatures : [...prev.enabledFeatures, feature]
              : prev.enabledFeatures.filter(f => f !== feature),
          };
        });
      },
    }
  );
}

export type UpdateFeatureOptions = {
  guild: string;
  feature: keyof CustomFeatures;
  options: FormData | string;
};
export function useUpdateFeatureMutation() {
  const { session } = useSession();
  return useMutation(
    (opts: UpdateFeatureOptions) => updateFeature(session!!, opts.guild, opts.feature, opts.options),
    {
      onSuccess(updated, opts) {
        return client.setQueryData(Keys.features(opts.guild, opts.feature), updated);
      },
    }
  );
}

export function useGuildRolesQuery(guild: string) {
  const { session } = useSession();
  return useQuery(Keys.guildRoles(guild), () => fetchGuildRoles(session!!, guild), {
    staleTime: 60_000,
  });
}

export function useGuildChannelsQuery(guild: string) {
  const { session } = useSession();
  return useQuery(Keys.guildChannels(guild), () => fetchGuildChannels(session!!, guild), {
    staleTime: 60_000,
  });
}

export function useSelfUser(): UserInfo {
  return useSelfUserQuery().data!!;
}

export function useGuildPreview(guild: string) {
  const query = useGuilds();
  return {
    guild: query.data?.find(g => g.id === guild),
    query,
  };
}
