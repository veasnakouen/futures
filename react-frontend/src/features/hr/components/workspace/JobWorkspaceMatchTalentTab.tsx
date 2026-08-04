import React from "react";
import { Badge, Button, Avatar } from "@/lib/flowbite-compat";

interface Props {
  candidates: any[];
  state: any;
}

export default function JobWorkspaceMatchTalentTab({ candidates, state }: Props) {
  const { applications, shortlistCandidate } = state;

  const matchedCandidates = candidates
    .map((c) => {
      let score = 50;
      if (c.status === "Searching") score += 20;
      return { ...c, matchScore: score + Math.floor(Math.random() * 30) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matchedCandidates.map((c) => {
        const isAlreadyShortlisted = applications.some(
          (app: any) => app.client?.id === c.id
        );
        return (
          <div
            key={c.id}
            className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800 group hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <Avatar size="md" rounded img={c.photo} />
                <div>
                  <h4 className="font-black uppercase tracking-tight text-sm dark:text-white">
                    {c.firstName} {c.lastName}
                  </h4>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {c.clientCode}
                  </p>
                </div>
              </div>
              <Badge color="success" className="font-black text-[9px]">
                {c.matchScore}% Match
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge color="gray" className="text-[8px] uppercase">
                {c.branch}
              </Badge>
              <Badge color="info" className="text-[8px] uppercase">
                {c.status}
              </Badge>
            </div>
            <Button
              color="blue"
              disabled={isAlreadyShortlisted}
              onClick={() => shortlistCandidate(c.id)}
              className="w-full font-black uppercase text-[10px] tracking-widest h-10 border-none cursor-pointer"
            >
              {isAlreadyShortlisted ? "In Pipeline" : "Shortlist Talent"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
