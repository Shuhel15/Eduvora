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
      <h1 className="max-w-5xl text-4xl font-black leading-[1.08] tracking-tight text-black drop-shadow-[0_5px_4px_rgba(0,0,0,0.12)] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-7xl dark:text-white py-5">
        Every thing you need to choose your path
      </h1>

      <div className="grid grid-cols sm:grid-cols-2 gap-4">
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 hover:bg-indigo-400/20 duration-200 transition-all bg-black/5 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-400/40 hover:-translate-y-1  ">
          <div className="bg-blue-300/40 rounded-xl p-1 w-fit">
            <GraduationCap className="h-8 w-8 dark:text-indigo-200 text-indigo-400 " />
          </div>
          <h3 className="text-lg font-semibold  py-2">AI-Powered Quiz</h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Answer 10 smart questions about your interests and strengths.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-emerald-400/20 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-400/40 hover:-translate-y-1 ">
          <div className="bg-emerald-300/40 rounded-xl p-1 w-fit">
            <Target className="h-8 w-8 dark:text-emerald-200 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold  py-2">
            Personalized Recommendation
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Our AI maps your answers to the perfect stream, course, and career
            path for you.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-yellow-400/20 hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/40 hover:-translate-y-1 ">
          <div className="bg-yellow-300/40 rounded-xl p-1 w-fit">
            <TrendingUp className="h-8 w-8 dark:text-yellow-200 text-yellow-400" />
          </div>
          <h3 className="text-lg font-semibold  py-2">
            Career & Salary Insights
          </h3>
          <p className="text-sm text-black/50 dark:text-white/50">
            Explore future jobs, average salaries, and growth scope.
          </p>
        </div>
        <div className="border dark:border-white/10 border-black/10 rounded-2xl p-4 text-start dark:bg-white/5 bg-black/5 duration-200 transition-all hover:bg-pink-400/40 hover:border-pink-400 hover:shadow-lg hover:shadow-pink-400/40  hover:-translate-y-1">
          <div className="bg-pink-300/40 rounded-xl p-1 w-fit">
            <Map className="h-8 w-8 dark:text-pink-200 text-pink-400" />
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
