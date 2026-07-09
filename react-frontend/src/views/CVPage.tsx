import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from '@/lib/react-router-compat';
import {Button, Spinner, Avatar, Badge, Alert} from '@/lib/flowbite-compat';
import {
  ArrowLeft,
  Printer,
  Download,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
  GraduationCap,
} from "lucide-react";

import api from "../services/api";
import { getFaceFocusedUrl } from "../utils/cloudinary";

const CVPage = ({ isDark, setIsDark }: any) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/clients/${id}/portfolio`);
      setData(response.data);
    } catch (err) {
      setError("Failed to load CV data.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading)
    return (
      <>
        <div className="flex justify-center p-20">
          <Spinner size="xl" />
        </div>
      </>
    );
  if (error || !data)
    return (
      <>
        <Alert color="failure">{error}</Alert>
      </>
    );

  const { client, educations, languages, computerSkills, jobExperiences } =
    data;

  return (
    <>
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center no-print">
          <Button
            color="gray"
            onClick={() => navigate(`/clients/${id}`)}
            className="rounded-md"
          >
            <ArrowLeft size={18} className="mr-2" /> Back to Profile
          </Button>
          <div className="flex gap-3">
            <Button
              color="blue"
              onClick={handlePrint}
              className="rounded-md shadow-lg shadow-blue-500/20"
            >
              <Printer size={18} className="mr-2" /> Print CV
            </Button>
            <Button color="gray" className="rounded-md">
              <Download size={18} className="mr-2" /> Export PDF
            </Button>
          </div>
        </header>

        {/* CV Document Preview */}
        <div
          className="bg-white dark:bg-gray-800 shadow-2xl rounded-md overflow-hidden p-0 md:p-12 print:p-0 print:shadow-none print:rounded-none"
          ref={printRef}
        >
          <div className="max-w-[210mm] mx-auto bg-white dark:bg-gray-900 min-h-[297mm] flex flex-col md:flex-row shadow-sm print:shadow-none">
            {/* Left Sidebar (Khmer Style) */}
            <div className="w-full md:w-72 bg-slate-900 text-white p-8 space-y-10">
              <div className="flex flex-col items-center gap-6">
                {client.photo ? (
                  <img
                    src={getFaceFocusedUrl(client.photo, 200)}
                    alt={`${client.firstName} ${client.lastName}`}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-slate-800"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-white font-extrabold text-2xl ring-4 ring-slate-800">
                    {(client.firstName?.[0] || "U") +
                      (client.lastName?.[0] || "N")}
                  </div>
                )}
                <div className="text-center">
                  <h1 className="text-2xl font-black uppercase tracking-tight leading-tight mb-1">
                    {client.firstName} {client.lastName}
                  </h1>
                  <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.2em]">
                    {client.clientCode}
                  </p>
                </div>
              </div>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">
                  Contact Info
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs">
                    <Phone size={14} className="text-blue-400" />{" "}
                    {client.contactPhone || "N/A"}
                  </div>
                  <div className="flex items-center gap-3 text-xs truncate">
                    <Mail size={14} className="text-blue-400" />{" "}
                    {client.email || "N/A"}
                  </div>
                  <div className="flex items-start gap-3 text-xs">
                    <MapPin
                      size={14}
                      className="text-blue-400 mt-0.5 shrink-0"
                    />
                    <span className="leading-relaxed">
                      {client.province || client.address || "Cambodia"}
                    </span>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">
                  Languages
                </h3>
                <div className="space-y-3">
                  {languages.map((l: any, i: number) => (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{l.name}</span>
                        <span className="text-slate-500">{l.level}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-md overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{
                            width: l.level === "Native" ? "100%" : "70%",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-800 pb-2">
                  Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {computerSkills.map((s: any, i: number) => (
                    <Badge
                      key={i}
                      color="gray"
                      className="bg-slate-800 text-slate-300 border-none px-2 py-0.5 text-[10px]"
                    >
                      {s.skill}
                    </Badge>
                  ))}
                </div>
              </section>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 space-y-12 dark:text-gray-200">
              <section className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <Briefcase className="text-blue-600" /> Professional
                  Experience
                </h2>
                <div className="space-y-8 relative before:absolute before:left-3 before:top-4 before:bottom-0 before:w-px before:bg-gray-100 dark:before:bg-gray-800">
                  {jobExperiences.map((ex: any, i: number) => (
                    <div key={i} className="relative pl-10">
                      <div className="absolute left-[7px] top-2 w-3 h-3 rounded-md bg-blue-600 ring-4 ring-white dark:ring-gray-900"></div>
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide">
                          {ex.employer}
                        </h4>
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded uppercase tracking-tighter">
                          {ex.duration || "Period N/A"}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-500 mb-2 italic">
                        Former Employee
                      </p>
                      <p className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
                        {ex.description ||
                          "Assisted in daily operations and business support tasks."}
                      </p>
                    </div>
                  ))}
                  {jobExperiences.length === 0 && (
                    <p className="text-sm text-gray-400 italic pl-10">
                      Seeking first career opportunity.
                    </p>
                  )}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <GraduationCap className="text-blue-600" /> Education
                  Background
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {educations.map((ed: any, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-md bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-blue-200 transition-all"
                    >
                      <h4 className="font-black text-gray-900 dark:text-white text-sm mb-1">
                        {ed.level} in {ed.subject}
                      </h4>
                      <p className="text-[10px] font-bold text-blue-600 mb-2 uppercase">
                        {ed.schoolName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Graduated: {ed.year || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                  <Award className="text-blue-600" /> Personal Attributes
                </h2>
                <div className="grid grid-cols-2 gap-4 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-md bg-blue-500"></div>{" "}
                    Team Player & Collaborator
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-md bg-blue-500"></div>{" "}
                    Rapid Learning Capabilities
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-md bg-blue-500"></div>{" "}
                    Punctual & Responsible
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-md bg-blue-500"></div>{" "}
                    Effective Problem Solver
                  </div>
                </div>
              </section>

              <div className="mt-20 pt-10 border-t text-center">
                <p className="text-[10px] text-gray-400 uppercase tracking-[0.3em]">
                  References available upon request
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          .no-print { display: none !important; }
          #document-root, #document-root * { visibility: visible; }
          .print-area, .print-area * { visibility: visible; }
          main { margin: 0 !important; padding: 0 !important; }
          .bg-slate-900 { background-color: #0f172a !important; -webkit-print-color-adjust: exact; }
          .text-white { color: white !important; }
          .text-blue-400 { color: #60a5fa !important; }
          .bg-blue-500 { background-color: #3b82f6 !important; -webkit-print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </>
  );
};

export default CVPage;
