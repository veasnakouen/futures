import React from "react";
import { Badge, Progress } from "@/lib/flowbite-compat";
import {
  Mail,
  Phone,
  Calendar,
  MapPin,
  Building2,
  GraduationCap,
  Stethoscope,
  User,
  Briefcase,
  Hash,
  ChevronRight,
  ExternalLink,
  X
} from "lucide-react";
import { format } from "date-fns";

const FacebookIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
);
const InstagramIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
);
const TwitterIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
);
const LinkedinIcon = ({ size = 24, ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
);

export type EntityType = "user" | "student" | "teacher" | "doctor" | "staff";

export interface HumanPortfolioProps {
  entityType: EntityType;
  data: {
    firstName: string;
    lastName?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    coverUrl?: string;
    status?: "active" | "inactive" | "suspended" | string;
    idNumber?: string;
    department?: string;
    joinedDate?: string | Date;
    location?: string;
    bio?: string;
    about?: string;
    skills?: Array<{ name: string; percentage: number }>;
    experiences?: Array<{ role: string; organization: string; period: string; description: string }>;
    projects?: Array<{ title: string; description: string; imageUrl?: string; link?: string }>;
    socials?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    };
  };
  actions?: React.ReactNode;
  children?: React.ReactNode;
  onClose?: () => void;
}

export default function HumanPortfolio({
  entityType,
  data,
  actions,
  children,
  onClose
}: HumanPortfolioProps) {
  const fullName = `${data.firstName} ${data.lastName || ""}`.trim();

  // Helper to get entity specific colors/icons
  const getEntityConfig = (type: EntityType) => {
    switch (type) {
      case "student":
        return { icon: GraduationCap, color: "text-orange-500", label: "Student" };
      case "teacher":
        return { icon: Briefcase, color: "text-orange-500", label: "Teacher" };
      case "doctor":
        return { icon: Stethoscope, color: "text-orange-500", label: "Doctor" };
      case "staff":
        return { icon: Building2, color: "text-orange-500", label: "Staff" };
      default:
        return { icon: User, color: "text-orange-500", label: "User" };
    }
  };

  const config = getEntityConfig(entityType);

  return (
    <div className="bg-transparent overflow-hidden relative group/portfolio">
      {/* Floating Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-sm"
        >
          <X size={20} />
        </button>
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center lg:items-start p-6 sm:p-10">

        {/* Left Column: Text and Contact Info */}
        <div className="w-full lg:w-1/2 flex flex-col pt-8 min-w-0">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl font-normal text-gray-900 dark:text-white mb-2 break-words">
              Hello, I'm <span className="font-semibold">{data.firstName}</span>
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {data.department ? (
                data.department.split(',').map((dept, idx) => (
                  <Badge key={idx} color="warning" size="md" className="px-3 py-1 text-sm font-medium rounded-full shadow-sm">
                    {dept.trim()}
                  </Badge>
                ))
              ) : (
                <Badge color="warning" size="md" className="px-3 py-1 text-sm font-medium rounded-full shadow-sm">
                  {config.label}
                </Badge>
              )}
            </div>

            {(data.bio || true) && (
              <p className="mt-6 text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-lg">
                {data.bio || "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."}
              </p>
            )}
            <div className="w-48 h-0.5 bg-orange-400 mt-6"></div>
          </div>

          {/* Contact Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              {data.phone && (
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <Phone className="w-6 h-6 text-teal-700 dark:text-teal-500 flex-shrink-0" fill="currentColor" />
                  <div>
                    <span className="font-medium text-lg">Phone : </span>
                    <a href={`tel:${data.phone}`} className="text-lg hover:text-orange-500 transition-colors">
                      {data.phone}
                    </a>
                  </div>
                </div>
              )}

              {data.email && (
                <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
                  <Mail className="w-6 h-6 text-teal-700 dark:text-teal-500 flex-shrink-0" fill="currentColor" />
                  <div>
                    <span className="font-medium text-lg">Email : </span>
                    <a href={`mailto:${data.email}`} className="text-lg hover:text-orange-500 transition-colors break-all">
                      {data.email}
                    </a>
                  </div>
                </div>
              )}

              {(data.location || true) && (
                <div className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-6 h-6 text-teal-700 dark:text-teal-500 flex-shrink-0 mt-1" fill="currentColor" />
                  <div>
                    <span className="font-medium text-lg">Address : </span>
                    <span className="text-lg">{data.location || "Delanson, New York, 12053"}</span>
                  </div>
                </div>
              )}

              {/* Extras (ID, Joined Date) */}
              {(data.idNumber || data.joinedDate) && (
                <div className="flex flex-wrap gap-x-6 gap-y-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  {data.idNumber && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 break-all min-w-0">
                      <Hash size={18} className="flex-shrink-0" />
                      <span className="font-medium truncate">ID: {data.idNumber}</span>
                    </div>
                  )}
                  {data.joinedDate && (
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      <Calendar size={18} className="flex-shrink-0" />
                      <span className="font-medium">
                        Joined: {typeof data.joinedDate === 'string' ? data.joinedDate : format(data.joinedDate, "MMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Social Icons inside document flow */}
              <div className="pt-2 flex flex-wrap gap-3">
                {(data.socials?.facebook || true) && (
                  <a href={data.socials?.facebook || "#"} className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <FacebookIcon size={16} fill="currentColor" strokeWidth={0} />
                  </a>
                )}
                {(data.socials?.instagram || true) && (
                  <a href={data.socials?.instagram || "#"} className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <InstagramIcon size={16} />
                  </a>
                )}
                {(data.socials?.twitter || true) && (
                  <a href={data.socials?.twitter || "#"} className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <TwitterIcon size={16} fill="currentColor" strokeWidth={0} />
                  </a>
                )}
                {(data.socials?.linkedin || true) && (
                  <a href={data.socials?.linkedin || "#"} className="w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center hover:bg-orange-500 transition-colors">
                    <LinkedinIcon size={16} fill="currentColor" strokeWidth={0} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Actions Area */}
          {actions && (
            <div className="mt-8 flex gap-4">
              {actions}
            </div>
          )}
        </div>

        {/* Right Column: Visual Composition */}
        <div className="w-full lg:w-1/2 relative flex justify-center items-center py-10 lg:py-0">
          {/* Background Decorative Shapes */}
          <div className="absolute top-0 right-1/4 w-48 h-48 bg-orange-500 rounded-full translate-x-12 -translate-y-4 z-0 mix-blend-multiply dark:mix-blend-normal opacity-90 blur-[1px]"></div>
          <div className="absolute bottom-0 right-1/4 w-56 h-56 bg-teal-800 dark:bg-teal-700 rounded-full translate-x-8 translate-y-12 z-0 opacity-90 blur-[1px]"></div>

          {/* Image Frame Wrapper */}
          <div className="relative z-10">
            {/* Offset stacked cards */}
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-xl transform rotate-6 translate-x-4 translate-y-2 border border-gray-100 dark:border-gray-700"></div>
            <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-3xl shadow-xl transform rotate-3 translate-x-2 translate-y-1 border border-gray-100 dark:border-gray-700"></div>

            {/* Main Image Container */}
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-2xl border border-gray-100 dark:border-gray-700 transform -rotate-1 transition-transform hover:rotate-0 duration-300">
              <div className="w-64 h-80 sm:w-72 sm:h-[420px] md:w-80 md:h-[460px] max-w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-900 relative">
                {data.avatarUrl ? (
                  <img
                    src={data.avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-orange-500 bg-orange-50 dark:bg-gray-800">
                    <span className="text-8xl font-black uppercase tracking-widest opacity-20">
                      {data.firstName.charAt(0)}
                      {data.lastName ? data.lastName.charAt(0) : ""}
                    </span>
                  </div>
                )}

                {/* Status indicator on image */}
                <div className="absolute top-4 right-4">
                  <Badge color={data.status === "active" ? "success" : data.status === "inactive" ? "failure" : "warning"} className="rounded-full shadow-md font-bold px-3">
                    {data.status || "Active"}
                  </Badge>
                </div>
              </div>

              {/* Floating Name Badge */}
              <div className="absolute -bottom-6 -right-6 sm:-right-8 bg-orange-500 text-white py-3 px-8 rounded-full shadow-xl z-20">
                <span className="text-lg font-medium">{fullName}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ADDITIONAL SECTIONS */}
      <div className="p-6 sm:p-10 space-y-16">

        {/* About Me Section */}
        {data.about && (
          <section className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-orange-500 pl-4">About Me</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {data.about}
              </p>
            </div>
          </section>
        )}

        {/* Skills & Expertise Section */}
        {data.skills && data.skills.length > 0 && (
          <section className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-orange-500 pl-4">Skills & Expertise</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.skills.map((skill, idx) => (
                <div key={idx} className="w-full">
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">{skill.name}</span>
                    <span className="text-orange-500 font-bold">{skill.percentage}%</span>
                  </div>
                  <Progress progress={skill.percentage} color="emerald" size="sm" className="[&>div>div]:bg-orange-500" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Timeline */}
        {data.experiences && data.experiences.length > 0 && (
          <section className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-orange-500 pl-4">Experience</h3>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <div className="relative border-l-2 border-gray-200 dark:border-gray-700 ml-3 md:ml-4 space-y-12 py-2">
                {data.experiences.map((exp, idx) => (
                  <div key={idx} className="relative pl-8 md:pl-10">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[13px] top-1 w-6 h-6 bg-white dark:bg-gray-800 border-4 border-orange-500 rounded-full shadow-sm"></div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">{exp.role}</h4>
                      <span className="text-teal-600 dark:text-teal-400 font-semibold text-sm whitespace-nowrap bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-full mt-2 sm:mt-0 inline-block">
                        {exp.period}
                      </span>
                    </div>
                    <div className="text-orange-500 font-medium mb-3 flex items-center gap-2">
                      <Building2 size={16} />
                      {exp.organization}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects / Gallery */}
        {data.projects && data.projects.length > 0 && (
          <section className="animate-fade-in-up">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-l-4 border-orange-500 pl-4">Recent Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.projects.map((project, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                  <div className="h-48 bg-gray-100 dark:bg-gray-700 relative overflow-hidden flex-shrink-0">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-500 to-teal-700">
                        <Briefcase className="text-white opacity-30" size={48} />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">{project.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                      {project.description}
                    </p>
                    {project.link && (
                      <a href={project.link} className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm group/link mt-auto">
                        View Project
                        <ExternalLink size={16} className="ml-1 group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Optional Children Area */}
      {children && (
        <div className="mt-8 border-t border-gray-100 dark:border-gray-800 pt-8 px-6 sm:px-10">
          {children}
        </div>
      )}
    </div>
  );
}
