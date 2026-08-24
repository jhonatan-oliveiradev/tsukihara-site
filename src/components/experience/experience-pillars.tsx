import { LostMemoriesChapter } from "@/components/experience/lost-memories-chapter";
import { immersiveCopy, type Locale } from "@/content/immersive-copy";

type Copy = (typeof immersiveCopy)[Locale];

type ExperiencePillarsProps = {
  copy: Copy;
  locale: Locale;
};

export function ExperiencePillars({ locale }: ExperiencePillarsProps) {
  return <LostMemoriesChapter locale={locale} />;
}
