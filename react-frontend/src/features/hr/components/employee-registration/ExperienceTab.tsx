import React from "react";
import {TextInput, Textarea, Button, Accordion, AccordionPanel, AccordionTitle, AccordionContent} from '@/lib/flowbite-compat';
import { type UseFormReturn, useFieldArray } from "react-hook-form";
import { type EmployeeFormData } from '../../../../schemas/employeeSchema';
import { Plus, Trash2, Briefcase, GraduationCap, Building } from "lucide-react";

interface ExperienceTabProps {
  formMethods: UseFormReturn<EmployeeFormData>;
}

const ExperienceTab: React.FC<ExperienceTabProps> = ({ formMethods }) => {
  const { register, control, watch } = formMethods;

  const {
    fields: expFields,
    append: appendExp,
    remove: removeExp,
  } = useFieldArray({
    control,
    name: "legacyWorkExperience",
  });

  const {
    fields: eduFields,
    append: appendEdu,
    remove: removeEdu,
  } = useFieldArray({
    control,
    name: "legacyEducation",
  });

  return (
    <div className="space-y-10 animate-fade-in pb-8">
      {/* Summary / Headline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Briefcase size={16} className="text-blue-500" /> Professional Summary
        </h4>
        <Textarea
          {...register("legacyPreviousPosition")}
          rows={3}
          placeholder="Brief overview of the most recent position, key skills, and primary responsibilities..."
          className="w-full text-sm font-medium bg-gray-50 dark:bg-gray-900/50 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Dynamic Work Experience */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <Building size={16} className="text-emerald-500" /> Work Experience
          </h4>
          <Button
            size="xs"
            color="light"
            onClick={() =>
              appendExp({
                company: "",
                position: "",
                duration: "",
                description: "",
              })
            }
            className="rounded-md shadow-sm font-bold uppercase tracking-wider text-[10px]"
          >
            <Plus size={14} className="mr-1" /> Add Role
          </Button>
        </div>

        <div className="space-y-4">
          {expFields.length > 0 && (
            <Accordion
              collapseAll
              className="divide-y-0 rounded-xl overflow-hidden shadow-sm"
            >
              {expFields.map((field, index) => (
                <AccordionPanel key={field.id}>
                  <AccordionTitle className="text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-0 py-3 px-5 border-b">
                    {watch(`legacyWorkExperience.${index}.company`) ||
                    watch(`legacyWorkExperience.${index}.position`)
                      ? `${watch(`legacyWorkExperience.${index}.position`) || "Role"} at ${watch(`legacyWorkExperience.${index}.company`) || "Company"}`
                      : `Work Experience #${index + 1}`}
                  </AccordionTitle>
                  <AccordionContent className="p-5 bg-gray-50 dark:bg-gray-800/50 relative">
                    <button
                      type="button"
                      onClick={() => removeExp(index)}
                      className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 text-red-500 rounded-md shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all z-10"
                      title="Remove Experience"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-10">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Company Name
                        </label>
                        <TextInput
                          {...register(
                            `legacyWorkExperience.${index}.company` as const,
                          )}
                          placeholder="e.g. Acme Corp"
                          sizing="sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Job Title
                        </label>
                        <TextInput
                          {...register(
                            `legacyWorkExperience.${index}.position` as const,
                          )}
                          placeholder="e.g. Senior Developer"
                          sizing="sm"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Duration
                        </label>
                        <TextInput
                          {...register(
                            `legacyWorkExperience.${index}.duration` as const,
                          )}
                          placeholder="e.g. Jan 2020 - Present"
                          sizing="sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                        Key Responsibilities
                      </label>
                      <Textarea
                        {...register(
                          `legacyWorkExperience.${index}.description` as const,
                        )}
                        rows={2}
                        placeholder="Describe achievements and duties..."
                        className="text-sm"
                      />
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              ))}
            </Accordion>
          )}

          {expFields.length === 0 && (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
              <Briefcase
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="text-sm font-bold text-gray-400">
                No work experience recorded.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click "Add Role" to add employment history.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Education */}
      <div className="pt-4 border-t">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
            <GraduationCap size={16} className="text-indigo-500" /> Academic
            Background
          </h4>
          <Button
            size="xs"
            color="light"
            onClick={() => appendEdu({ institution: "", degree: "", year: "" })}
            className="rounded-md shadow-sm font-bold uppercase tracking-wider text-[10px]"
          >
            <Plus size={14} className="mr-1" /> Add Degree
          </Button>
        </div>

        <div className="space-y-4">
          {eduFields.length > 0 && (
            <Accordion
              collapseAll
              className="divide-y-0 rounded-xl overflow-hidden shadow-sm"
            >
              {eduFields.map((field, index) => (
                <AccordionPanel key={field.id}>
                  <AccordionTitle className="text-xs font-bold text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 focus:ring-0 py-3 px-5 border-b">
                    {watch(`legacyEducation.${index}.degree`) ||
                    watch(`legacyEducation.${index}.institution`)
                      ? `${watch(`legacyEducation.${index}.degree`) || "Degree"} at ${watch(`legacyEducation.${index}.institution`) || "Institution"}`
                      : `Degree #${index + 1}`}
                  </AccordionTitle>
                  <AccordionContent className="p-5 bg-indigo-50/20 dark:bg-indigo-900/10 relative">
                    <button
                      type="button"
                      onClick={() => removeEdu(index)}
                      className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-700 text-red-500 rounded-md shadow-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all z-10"
                      title="Remove Degree"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pr-10">
                      <div className="md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Institution
                        </label>
                        <TextInput
                          {...register(
                            `legacyEducation.${index}.institution` as const,
                          )}
                          placeholder="e.g. University of Science"
                          sizing="sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Graduation Year
                        </label>
                        <TextInput
                          {...register(
                            `legacyEducation.${index}.year` as const,
                          )}
                          placeholder="e.g. 2019"
                          sizing="sm"
                        />
                      </div>
                      <div className="md:col-span-3">
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                          Degree / Certification
                        </label>
                        <TextInput
                          {...register(
                            `legacyEducation.${index}.degree` as const,
                          )}
                          placeholder="e.g. Bachelor of Computer Science"
                          sizing="sm"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionPanel>
              ))}
            </Accordion>
          )}

          {eduFields.length === 0 && (
            <div className="text-center py-8 bg-indigo-50/20 dark:bg-indigo-900/10 rounded-xl border-indigo-100 dark:border-indigo-900/30">
              <GraduationCap
                size={32}
                className="mx-auto text-gray-300 dark:text-gray-600 mb-3"
              />
              <p className="text-sm font-bold text-gray-400">
                No academic background recorded.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click "Add Degree" to add qualifications.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExperienceTab;
