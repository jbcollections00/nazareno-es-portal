import { FaAward } from "react-icons/fa";

export default function PrincipalMessage() {
  return (
    <section className="py-20 bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-10 lg:p-16">
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-5 py-2 rounded-full font-semibold">
                <FaAward />
                School Head's Message
              </div>
            </div>

            <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mb-12"></div>

            <div className="flex flex-col lg:flex-row gap-12 items-start">
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white rounded-3xl p-4 shadow-xl border border-slate-200 sticky top-24">
                  <img
                    src="/faculty/jonel.jpg"
                    alt="School Head"
                    className="w-full rounded-2xl"
                  />

                  <div className="text-center pt-5">
                    <h3 className="text-2xl font-bold text-slate-900">
                      JONEL E. BUERGO
                    </h3>

                    <p className="text-blue-700 font-semibold">
                      Master Teacher I
                    </p>

                    <p className="text-slate-500">
                      Teacher-In-Charge
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <div className="text-slate-700">
                  <p className="mb-8 text-lg">
                    Dear Learners, Parents, Teachers,
                    Stakeholders, and Members of the
                    Community,
                  </p>

                 <p className="text-lg leading-9 text-justify indent-12 mb-6">
  Welcome to Nazareno Elementary School. It is our
  commitment to provide quality, inclusive, and
  learner-centered education that empowers every
  child to achieve academic excellence and develop
  strong values that will guide them throughout
  life.
</p>

<p className="text-lg leading-9 text-justify indent-12 mb-6">
  Together with our dedicated teachers, supportive
  parents, and valued stakeholders, we continue to
  create a nurturing environment where learners are
  encouraged to grow, explore their potential, and
  become responsible members of the community.
</p>

<p className="text-lg leading-9 text-justify indent-12 mb-6">
  Thank you for your trust and support. We invite
  you to join us as we work hand in hand in shaping
  the future of our learners and building a school
  community founded on excellence, integrity, and
  service.
</p>

                  <div className="mt-12 pt-8 border-t border-slate-200">
                    <p className="mb-10 text-lg">
                      Respectfully yours,
                    </p>

                    <h4 className="text-3xl font-bold text-slate-900">
                      JONEL E. BUERGO
                    </h4>

                    <p className="text-blue-700 font-semibold text-lg">
                      Master Teacher I
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}