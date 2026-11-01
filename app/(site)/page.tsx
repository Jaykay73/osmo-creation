import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { IndexStrip } from "@/components/home/IndexStrip";
import { Intro } from "@/components/home/Intro";
import { FeaturedStories } from "@/components/home/FeaturedStories";
import { FilmsSection } from "@/components/home/FilmsSection";
import { HumanElement } from "@/components/home/HumanElement";
import { Closing } from "@/components/home/Closing";
import { StorySequence } from "@/components/home/StorySequence";
import { ChapterNav } from "@/components/home/ChapterNav";
import { HomeGallery } from "@/components/home/HomeGallery";
import { BookingSection } from "@/components/home/BookingSection";
import { exhibitionWorks } from "@/content/exhibition";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <IndexStrip />
      <StorySequence />
      <Intro />
      <HomeGallery works={exhibitionWorks} />
      <BookingSection />
      <FeaturedStories />
      <FilmsSection />
      <HumanElement />
      <Closing />
      <ChapterNav />
    </>
  );
}
