import { SimpleGrid } from '@chakra-ui/layout';
import { MemeFeature, UseFormRender, memeFeatureSchema } from '@/config/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChannelSelectForm } from '@/components/forms/ChannelSelect';
import { FormCardController } from '@/components/forms/Form';
import { SelectField } from '@/components/forms/SelectField';
import type { OptionBase } from 'chakra-react-select';

type Option = OptionBase & {
  label: string;
  value: Exclude<MemeFeature['source'], undefined>;
};

const sources: Option[] = [
  { label: 'YouTube', value: 'youtube' },
  { label: 'Twitter', value: 'twitter' },
  { label: 'Discord', value: 'discord' },
];

export const useMemeFeature: UseFormRender<MemeFeature> = (data, onSubmit) => {
  const { reset, handleSubmit, formState, control } = useForm<MemeFeature>({
    resolver: zodResolver(memeFeatureSchema),
    shouldUnregister: false,
    defaultValues: {
      channel: data?.channel,
      source:  data?.source,
    },
  });

  return {
    component: (
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
        <ChannelSelectForm
          control={{ label: 'Meme Channel', description: 'Channel to auto-post memes in' }}
          controller={{ control, name: 'channel' }}
        />
        <FormCardController
          control={{ label: 'Meme Source', description: 'Where to pull memes from' }}
          controller={{ control, name: 'source' }}
          render={({ field }) => (
            <SelectField<Option>
              {...field}
              value={field.value != null ? sources.find((v) => v.value === field.value) : undefined}
              onChange={(v) => v && field.onChange(v.value)}
              options={sources}
            />
          )}
        />
      </SimpleGrid>
    ),
    onSubmit: handleSubmit(async (e) => {
      const updated = await onSubmit(JSON.stringify({ channel: e.channel, source: e.source }));
      // Map server response back to form shape safely
      const resp = updated as MemeFeature | undefined;
      reset({ channel: resp?.channel ?? e.channel, source: resp?.source ?? e.source });
    }),
    canSave: formState.isDirty,
    reset: () => reset(control._defaultValues),
  };
};
