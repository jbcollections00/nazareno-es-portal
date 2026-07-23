import { supabase } from "@/lib/supabase";
import { FaUserTie, FaChalkboardTeacher, FaIdBadge } from "react-icons/fa";

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
      person.position?.includes("Teacher-In-Charge")
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
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 relative overflow-hidden pb-24">
      {/* Decorative Vibrant Background Blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-pink-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 pt-20 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight mb-6">
            Faculty <span className="text-slate-400 font-medium">&</span> <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Staff</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
            Meet the dedicated educators and personnel who help shape the future of our learners.
          </p>

          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-12 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></span>
            <span className="w-4 h-1.5 bg-amber-400 rounded-full"></span>
            <span className="w-12 h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
          </div>
        </div>

        {/* School Leadership Section */}
        {schoolHead && (
          <div className="mb-20">
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px bg-gradient-to-r from-transparent to-slate-300 flex-1 max-w-[150px]"></div>
              <h2 className="text-3xl font-extrabold text-slate-800 uppercase tracking-wider">
                School Leadership
              </h2>
              <div className="h-px bg-gradient-to-r from-slate-300 to-transparent flex-1 max-w-[150px]"></div>
            </div>

            <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 p-10 border border-slate-100 relative overflow-hidden group hover:-translate-y-2 transition-transform duration-500">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-100/50 to-transparent rounded-bl-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center gap-10 relative z-10">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                  {schoolHead.photo ? (
                    <img
                      src={schoolHead.photo}
                      alt={schoolHead.name}
                      className="w-48 h-48 md:w-56 md:h-56 rounded-full object-cover border-4 border-white shadow-xl relative z-10 group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-48 h-48 md:w-56 md:h-56 rounded-full border-4 border-white shadow-xl relative z-10 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                      <FaUserTie className="text-7xl text-indigo-300" />
                    </div>
                  )}
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 transition-all">
                    {schoolHead.name}
                  </h3>

                  <div className="inline-block bg-indigo-50 border border-indigo-100 px-4 py-1.5 rounded-full mb-4">
                    <p className="text-indigo-700 font-bold text-sm uppercase tracking-wide">
                      {schoolHead.position}
                    </p>
                  </div>

                  <p className="text-slate-600 md:text-lg leading-relaxed max-w-md font-medium">
                    Leading the school community toward excellence in education and learner success.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Teaching Personnel Section */}
        <div className="mb-20">
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent to-slate-300 flex-1 max-w-[100px] md:max-w-[200px]"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-3 text-center">
              <FaChalkboardTeacher className="text-blue-500 shrink-0" /> 
              <span className="hidden sm:inline">Teaching Personnel</span>
              <span className="sm:hidden">Teachers</span>
            </h2>
            <div className="h-px bg-gradient-to-r from-slate-300 to-transparent flex-1 max-w-[100px] md:max-w-[200px]"></div>
          </div>

          {teaching.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-12 text-center shadow-md">
              <p className="text-slate-500 font-medium">No teaching personnel found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {teaching.map((member) => (
                <div
                  key={member.id}
                  /* Pinalapad nang konti to max-w-[300px] para may space ang pangalan */
                  className="w-full max-w-[300px] bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center group hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md relative z-10 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full border-4 border-white shadow-md relative z-10 bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <FaChalkboardTeacher className="text-5xl text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* FIXED: Added 'truncate w-full' para mapilitang mag-isang linya lang */}
                  <h3 
                    className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-blue-600 transition-colors w-full truncate px-2"
                    title={member.name}
                  >
                    {member.name}
                  </h3>

                  <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit max-w-full">
                    {member.position}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Non-Teaching Staff Section */}
        <div>
          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="h-px bg-gradient-to-r from-transparent to-slate-300 flex-1 max-w-[100px] md:max-w-[200px]"></div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-3 text-center">
              <FaIdBadge className="text-indigo-500 shrink-0" /> 
              <span className="hidden sm:inline">Non-Teaching Staff</span>
              <span className="sm:hidden">Staff</span>
            </h2>
            <div className="h-px bg-gradient-to-r from-slate-300 to-transparent flex-1 max-w-[100px] md:max-w-[200px]"></div>
          </div>

          {nonTeaching.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-dashed border-slate-200 p-12 text-center shadow-md">
              <p className="text-slate-500 font-medium">No non-teaching staff found.</p>
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {nonTeaching.map((member) => (
                <div
                  key={member.id}
                  /* Pinalapad din to max-w-[300px] */
                  className="w-full max-w-[300px] bg-white rounded-3xl shadow-lg border border-slate-100 p-8 flex flex-col items-center text-center group hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full blur-md opacity-0 group-hover:opacity-40 transition-opacity duration-300"></div>
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-md relative z-10 group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-36 h-36 rounded-full border-4 border-white shadow-md relative z-10 bg-slate-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <FaIdBadge className="text-5xl text-slate-300" />
                      </div>
                    )}
                  </div>

                  {/* FIXED: Added 'truncate w-full' para mapilitang mag-isang linya lang */}
                  <h3 
                    className="text-lg font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors w-full truncate px-2"
                    title={member.name}
                  >
                    {member.name}
                  </h3>

                  <p className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full w-fit max-w-full">
                    {member.position}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}