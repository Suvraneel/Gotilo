import Spliner from "@components/Spliner"
import { swera } from "@fonts"
import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/router"

export default function Home() {

  const { push } = useRouter();

  return (
    <main>
      <Spliner scene={"https://prod.spline.design/TmLa-bcpmxHw90XL/scene.splinecode"} />
      <div className="flex-1 w-full h-full p-4 lg:px-40 overflow-visible flex flex-col justify-start items-start gap-16 pt-40">

      <div className="relative flex place-items-center before:absolute before:h-[200px] before:w-[780px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/2 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[260px] z-[-1]">
        <h1 className={`text-6xl text-white ${swera.className}`}>SuperMeets</h1>
      </div>
      <button
            type="button"
            onClick={() => push("/preference")}
            className="flex w-40 items-center justify-center rounded-md py-3 text-slate-100 font-semibold bg-blue-600 group hover:bg-blue-900"
          >
            Start Meeting
            <ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
          </button>
          </div>
    </main>
  )
}
