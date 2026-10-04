import { GraduationCap, Map, Target, TrendingUp } from "lucide-react";

export default function Whatweoffer() {
  return (
    <section
      id="howitworks"
      className="flex flex-col items-center justify-center text-center mt-20 "
    >
      <p className="uppercase gap-2 flex items-center text-sm font-medium tracking-widest text-[#6366F1]">
        <span className="h-0.5 w-5 bg-[#6366F1]" />
        what we offer
        <span className="h-0.5 w-5 bg-[#6366F1]" />
      </p>
      <h1 className="max-w-5xl text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl dark:text-white mt-10 mb-10">
        Every thing you need to choose your path
      </h1>

      <div className="grid grid-cols sm:grid-cols-2 gap-4">
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 hover:bg-indigo-400/20 duration-200 transition-all bg-black/5 hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-400/40 hover:-translate-y-1  ">
          <div className="bg-indigo-500/25 rounded-xl p-2 w-fit">
            <GraduationCap className="h-6 w-6 text-indigo-500" />
          </div>
          <h3 className="text-lg font-semibold  py-2">AI-Powered Quiz</h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Answer 10 smart questions about your interests and strengths.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-emerald-400/20 hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-400/40 hover:-translate-y-1 ">
          <div className="bg-emerald-500/25 rounded-xl p-2 w-fit">
            <Target className="h-6 w-6 text-emerald-500" />
          </div>
          <h3 className="text-lg font-semibold  py-2">
            Personalized Recommendation
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Our AI maps your answers to the perfect stream, course, and career
            path for you.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-yellow-400/20 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-400/40 hover:-translate-y-1 ">
          <div className="bg-yellow-500/25 rounded-xl p-2 w-fit">
            <TrendingUp className="h-6 w-6 text-yellow-500 " />
          </div>
          <h3 className="text-lg font-semibold  py-2">
            Career & Salary Insights
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Explore future jobs, average salaries, and growth scope.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-pink-400/40 hover:border-pink-500 hover:shadow-lg hover:shadow-pink-400/40  hover:-translate-y-1">
          <div className="bg-pink-500/25 rounded-xl p-2 w-fit">
            <Map className="h-6 w-6 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold  py-2">
            Find Colleges Near You
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Google Maps shows top colleges offering your course nearby.
          </p>
        </div>
      </div>
    </section>
  );
}
