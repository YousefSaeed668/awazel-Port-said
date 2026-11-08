import { MaxWidth } from "@/components/MaxWidth";
import type { ProjectDetailContent } from "@/lib/project-detail";

import { ProjectBody } from "./project-body";
import { ProjectSidebar } from "./project-sidebar";

export function ProjectNarrative({
  project,
}: {
  project: ProjectDetailContent;
}) {
  return (
    <section className="border-t border-border bg-card py-16">
      <MaxWidth>
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 lg:col-span-7">
            <ProjectBody value={project.body} />
          </div>
          <div className="min-w-0 lg:col-span-5">
            <ProjectSidebar sidebar={project.sidebar} />
          </div>
        </div>
      </MaxWidth>
    </section>
  );
}
