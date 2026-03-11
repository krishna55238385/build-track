"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { Project } from "@/lib/types";

interface ProjectContextValue {
  project: Project | null;
  setProject: (p: Project | null) => void;
  refreshKey: number;
  refresh: () => void;
}

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({
  children,
  initialProject,
}: {
  children: React.ReactNode;
  initialProject?: Project | null;
}) {
  const [project, setProject] = useState<Project | null>(initialProject ?? null);
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return (
    <ProjectContext.Provider
      value={{ project, setProject, refreshKey, refresh }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error("useProject must be used within ProjectProvider");
  return ctx;
}
