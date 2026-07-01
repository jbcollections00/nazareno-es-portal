import { supabase } from "@/lib/supabase";

export const metadata = {
  title: "Faculty & Staff",
};

export default async function FacultyPage() {
  const { data: faculty } = await supabase
    .from("faculty")
    .select("*")
    .order("id", { ascending: true });

  const schoolHead =
    faculty?.find((person) =>
      person.position?.includes(
        "Teacher-In-Charge"
      )
    ) || faculty?.[0];

  const teaching =
    faculty?.filter(
      (person) =>
        person.id !== schoolHead?.id &&
        person.position?.includes("Teacher")
    ) || [];

  const nonTeaching =
    faculty?.filter(
      (person) =>
        person.id !== schoolHead?.id &&
        !person.position?.includes("Teacher")
    ) || [];

  return (
    <section className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-4">
            Faculty & Staff
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Meet the dedicated educators
            and personnel who help shape
            the future of our learners.
          </p>

          <div className="w-24 h-1 bg-yellow-400 rounded-full mx-auto mt-8"></div>
        </div>

        {schoolHead && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              School Leadership
            </h2>

            <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
              <div className="flex justify-center mb-6">
                {schoolHead.photo ? (
                  <img
                    src={schoolHead.photo}
                    alt={schoolHead.name}
                    className="w-56 h-56 rounded-full object-cover border-4 border-blue-100"
                  />
                ) : (
                  <div className="w-56 h-56 rounded-full bg-slate-200" />
                )}
              </div>

              <div className="text-center">
                <h3 className="text-3xl font-bold text-slate-900 mb-2">
                  {schoolHead.name}
                </h3>

                <p className="text-blue-700 font-semibold text-lg">
                  {schoolHead.position}
                </p>

                <p className="text-slate-600 mt-4 leading-7">
                  Leading the school community
                  toward excellence in
                  education and learner
                  success.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Teaching Personnel
          </h2>

          {teaching.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              No teaching personnel found.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {teaching.map((member) => (
                <div
                  key={member.id}
                  className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex justify-center mb-5">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-slate-200" />
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                      {member.name}
                    </h3>

                    <p className="text-blue-700 font-medium mt-2">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-center mb-10">
            Non-Teaching Staff
          </h2>

          {nonTeaching.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
              No non-teaching staff found.
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {nonTeaching.map((member) => (
                <div
                  key={member.id}
                  className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="flex justify-center mb-5">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-blue-100"
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-full bg-slate-200" />
                    )}
                  </div>

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">
                      {member.name}
                    </h3>

                    <p className="text-blue-700 font-medium mt-2">
                      {member.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}