import {
  Lightbulb,
  Sparkles,
  TrendingUp,
  GraduationCap,
} from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "01",
      icon: Lightbulb,
      title: "Take the Quiz",
      description: (
        <>
          Answer 15 smart questions
          <br />
          about your interests
        </>
      ),
      iconClass: "text-indigo-300",
      circleClass:
        "border-indigo-500/30 bg-indigo-500/10 hover:shadow-indigo-500/40 hover:shadow-lg",
    },
    {
      number: "02",
      icon: Sparkles,
      title: "Get AI Suggestions",
      description: (
        <>
          AI analyses and finds your
          <br />
          best career match
        </>
      ),
      iconClass: "text-emerald-300",
      circleClass:
        "border-emerald-500/30 bg-emerald-500/10 hover:shadow-emerald-500/40 hover:shadow-lg",
    },
    {
      number: "03",
      icon: TrendingUp,
      title: "Explore Careers",
      description: (
        <>
          See jobs, salary & growth
          <br />
          potential
        </>
      ),
      iconClass: "text-yellow-300",
      circleClass:
        "border-yellow-500/30 bg-yellow-500/10 hover:shadow-yellow-500/40 hover:shadow-lg",
    },
    {
      number: "04",
      icon: GraduationCap,
      title: "Find Colleges",
      description: (
        <>
          Get colleges near you
          <br />
          offering that course
        </>
      ),
      iconClass: "text-pink-300",
      circleClass:
        "border-pink-500/30 bg-pink-500/10 hover:shadow-pink-500/40 hover:shadow-lg",
    },
  ];

  return (
    <section id="process" className="w-full py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mb-16 text-center">
          <p className="mb-5 flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-400">
            <span className="h-0.5 w-5 bg-emerald-400" />
            SIMPLE PROCESS
            <span className="h-0.5 w-5 bg-emerald-400" />
          </p>

          <h1
            className=" mx-auto mt-10 mb-10 max-w-5xl text-center text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl dark:text-white
            "
          >
            4 steps to your future
          </h1>
        </div>

        {/* Steps */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-4">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Icon */}
                  <div className="relative z-10">
                    <div
                      className={`group relative flex h-16 w-16 items-center justify-center rounded-full border duration-300 ${step.circleClass}`}
                    >
                      <Icon
                        className={`h-7 w-7 transition-transform group-hover:-translate-y-0.5 duration-300  ${step.iconClass}`}
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Number */}
                    <span className="absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[11px] font-bold text-white shadow-lg">
                      {step.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-5 text-md dark:text-white text-black font-bold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm font-medium leading-5 dark:text-white/50 text-black/50 sm:text-sm sm:leading-6">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}