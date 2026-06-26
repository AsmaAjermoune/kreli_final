function HeroSkeleton() {
  return (
    <div className="relative flex min-h-[600px] animate-pulse">
      <div className="absolute inset-0 bg-gray-300" />
      <div className="relative mx-auto flex w-full max-w-[1024px] flex-col items-center gap-8 px-4 py-24">
        <div className="h-16 w-96 rounded-lg bg-gray-400/50" />
        <div className="h-8 w-[500px] rounded-lg bg-gray-400/30" />
        <div className="flex gap-4 pt-4">
          <div className="h-14 w-40 rounded-full bg-gray-400/50" />
          <div className="h-14 w-40 rounded-full border-2 border-white/30 bg-gray-400/30" />
        </div>
      </div>
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-12 px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="h-10 w-48 rounded-lg bg-gray-200" />
            <div className="h-[6px] w-24 rounded-full bg-gray-200" />
          </div>
          <div className="h-6 w-80 rounded-lg bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[400px] rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedSkeleton() {
  return (
    <section className="py-24" style={{ backgroundColor: "#ebebeb" }}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div className="h-10 w-80 rounded-lg bg-gray-200" />
            <div className="h-6 w-60 rounded-lg bg-gray-200" />
          </div>
          <div className="h-6 w-44 rounded-lg bg-gray-200" />
        </div>
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="h-48 rounded-xl bg-gray-200" />
              <div className="mt-4 h-4 w-3/4 rounded-lg bg-gray-200" />
              <div className="mt-2 h-4 w-1/2 rounded-lg bg-gray-200" />
              <div className="mt-4 h-10 w-full rounded-full bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSkeleton() {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-60 rounded-lg bg-gray-200" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 w-5 rounded-full bg-gray-200" />
            ))}
          </div>
        </div>
        <div className="flex gap-8" style={{ minWidth: "max-content" }}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="min-w-[400px] rounded-2xl bg-gray-100 p-10" style={{ height: "320px" }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASkeleton() {
  return (
    <section style={{ backgroundColor: "#004e98" }} className="py-20">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-16 px-4">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="h-10 w-80 rounded-lg bg-white/20" />
          <div className="h-6 w-[400px] rounded-lg bg-white/10" />
        </div>
        <div className="flex shrink-0 gap-16">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-16 rounded-lg bg-white/20" />
            <div className="h-3 w-12 rounded bg-white/10" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-16 rounded-lg bg-white/20" />
            <div className="h-3 w-12 rounded bg-white/10" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-16 rounded-lg bg-white/20" />
            <div className="h-3 w-12 rounded bg-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-16 rounded-lg bg-gray-200" />
          </div>
          <div className="hidden flex-1 md:flex max-w-[448px]">
            <div className="flex h-10 w-full items-center rounded-full bg-gray-100 px-4" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 rounded-lg bg-gray-200" />
            <div className="h-8 w-24 rounded-full bg-gray-300" />
          </div>
        </div>
      </header>

      <HeroSkeleton />
      <CategoriesSkeleton />
      <FeaturedSkeleton />
      <TestimonialsSkeleton />
      <CTASkeleton />
      
      <footer className="bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-4">
          <div className="h-4 w-32 rounded bg-gray-200" />
        </div>
      </footer>
    </div>
  );
}