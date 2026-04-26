"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Trash2, ExternalLink, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TryOnProject {
  id: string;
  name: string | null;
  description: string | null;
  bodyPhotoUrl: string;
  tattooImageUrl: string;
  resultUrl: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectListProps {
  projects: TryOnProject[];
  onSelect: (project: TryOnProject) => void;
  onDelete: (id: string) => void;
  selectedId?: string;
  isLoading?: boolean;
}

export function ProjectList({
  projects,
  onSelect,
  onDelete,
  selectedId,
  isLoading = false,
}: ProjectListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center border-white/10 bg-white/5">
        <p className="text-sm text-white/60">Loading projects...</p>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center border-white/10 bg-white/5">
        <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
          <Clock className="h-8 w-8 text-white/20" />
        </div>
        <h3 className="text-lg font-medium text-white mb-1">No projects yet</h3>
        <p className="text-sm text-white/60">
          Create your first try-on project to see it here
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card
          key={project.id}
          className={`p-4 border-white/10 bg-white/5 cursor-pointer transition-all hover:bg-white/[0.07] ${
            selectedId === project.id ? "ring-2 ring-brand-500" : ""
          }`}
          onClick={() => onSelect(project)}
        >
          <div className="flex items-center gap-4">
            {/* Thumbnail */}
            <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
              <img
                src={project.resultUrl || project.bodyPhotoUrl}
                alt={project.name || "Try-on project"}
                className="h-full w-full object-cover"
              />
              {project.status === "EXPORTED" && (
                <div className="absolute bottom-0 left-0 right-0 bg-green-500/80 text-[10px] text-white text-center py-0.5">
                  Saved
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-white truncate">
                {project.name || "Untitled Project"}
              </h4>
              <p className="text-sm text-white/60">
                {formatDistanceToNow(new Date(project.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>

            {/* Actions */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(project);
                  }}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-400 focus:text-red-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(project.id);
                  }}
                  disabled={deletingId === project.id}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deletingId === project.id ? "Deleting..." : "Delete"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>
      ))}
    </div>
  );
}
