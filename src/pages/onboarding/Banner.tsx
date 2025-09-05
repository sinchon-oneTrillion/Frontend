type Props = { src: string; alt?: string };

export default function Banner({ src, alt = 'Onboarding banner' }: Props) {
  return (
    <section className="mb-10 relative">
      <img
        src={src}
        alt={alt}
        className={[
          'w-full flex-shrink-0 object-cover object-center rounded-xl',

          'aspect-[375/240]', // base
          'sm:aspect-[640/300]',
          'md:aspect-[768/340]',
          'lg:aspect-[1024/400]',
          'xl:aspect-[1440/437]',
        ].join(' ')}
      />
    </section>
  );
}
