import { SimpleGrid } from '@chakra-ui/layout';
import { TextAreaForm } from '@/components/forms/TextAreaForm';
import { UseFormRender, WelcomeMessageFeature } from '@/config/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SmallColorPickerForm } from '@/components/forms/ColorPicker';
import { SwitchFieldForm } from '@/components/forms/SwitchField';
import { ChannelSelectForm } from '@/components/forms/ChannelSelect';

const schema = z.object({
  message: z.string().min(1, 'Message is required'),
  channel: z.string().optional(),
  embedColor: z.string().optional(),
  showAvatar: z.boolean().default(false),
});

type Input = z.infer<typeof schema>;

export const useWelcomeMessageFeature: UseFormRender<WelcomeMessageFeature> = (data, onSubmit) => {
  const { register, reset, handleSubmit, formState, control } = useForm<Input>({
    resolver: zodResolver(schema),
    shouldUnregister: false,
    defaultValues: {
      channel:    data?.channel    ?? '',
      message:    data?.message    ?? '',
      embedColor: data?.embedColor ?? '',
      showAvatar: data?.showAvatar ?? false,
    },
  });

  return {
    component: (
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={3}>
        <ChannelSelectForm
          control={{ label: 'Welcome Channel', description: 'Channel to send the welcome message in' }}
          controller={{ control, name: 'channel' }}
        />
        <TextAreaForm
          control={{
            label: 'Welcome Message',
            description: 'Message to send. Use {user}, {server}, {membercount}',
            error: formState.errors.message?.message,
          }}
          placeholder="Welcome {user} to {server}! You are member #{membercount}."
          {...register('message')}
        />
        <SmallColorPickerForm
          control={{ label: 'Embed Color', description: 'Color of the embed border' }}
          supportAlpha
          controller={{ control, name: 'embedColor' }}
        />
        <SwitchFieldForm
          control={{ label: 'Show Avatar', description: "Show new member's avatar in the message" }}
          controller={{ control, name: 'showAvatar' }}
        />
      </SimpleGrid>
    ),
    onSubmit: handleSubmit(async (e) => {
      const updated = await onSubmit(
        JSON.stringify({
          message:    e.message,
          channel:    e.channel,
          embedColor: e.embedColor,
          showAvatar: e.showAvatar,
        })
      );
      // Reset with the returned server data mapped back to our form shape
      reset({
        channel:    (updated as WelcomeMessageFeature)?.channel    ?? e.channel,
        message:    (updated as WelcomeMessageFeature)?.message    ?? e.message,
        embedColor: (updated as WelcomeMessageFeature)?.embedColor ?? e.embedColor,
        showAvatar: (updated as WelcomeMessageFeature)?.showAvatar ?? e.showAvatar,
      });
    }),
    canSave: formState.isDirty,
    reset: () => reset(control._defaultValues),
  };
};
