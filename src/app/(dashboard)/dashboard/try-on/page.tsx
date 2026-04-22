"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Camera, Save, Download, Loader2, Plus, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/tryon/image-uploader";
import { TattooSelector } from "@/components/tryon/tattoo-selector";
import { TransformCanvas } from "@/components/tryon/transform-canvas";
import { TransformControls } from "@/components/tryon/transform-controls";
import { ProjectList } from "@/components/tryon/project-list";
import { TransformState, CreateTryOnProjectInput } from "@/lib/validations/tryon";
import {
  createTryOnProject,
  updateTryOnProject,
  deleteTryOnProject,
  getTryOnProjects,
  getTryOnProject,
} from "@/app/actions/tryon";
import { toast } from "sonner";

const defaultTransform: TransformState = {
  positionX: 0.5,
  positionY: 0.5,
  scale: 1,
  rotation: 0,
  opacity: 0.85,
  blendMode: "MULTIPLY",
  flipX: false,
  flipY: false,
};

export default function TryOnPage() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");
  const canvasRef = useRef<{ exportImage: () => string }>(null);

  // Project state
  const [projectName, setProjectName] = useState("New Try-On Project");
  const [bodyPhotoUrl, setBodyPhotoUrl] = useState("");
  const [bodyPhotoId, setBodyPhotoId] = useState("");
  const [tattooUrl, setTattooUrl] = useState("");
  const [tattooSource, setTattooSource] = useState<"GENERATED" | "UPLOADED" | "GALLERY">("GENERATED");
  const [transform, setTransform] = useState<TransformState>(defaultTransform);

  // UI state
  const [activeView, setActiveView] = useState<"editor" | "projects">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Load project if ID in URL
  useEffect(() => {
    if (projectId) {
      loadProject(projectId);
    }
  }, [projectId]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    const result = await getTryOnProjects();
    if (result.success && result.data) {
      setProjects(result.data);
    }
    setIsLoadingProjects(false);
  };

  const loadProject = async (id: string) => {
    const result = await getTryOnProject(id);
    if (result.success && result.data) {
      const project = result.data;
      setProjectName(project.name);
      setBodyPhotoUrl(project.bodyPhotoUrl);
      setBodyPhotoId(project.bodyPhotoId);
      setTattooUrl(project.tattooImageUrl);
      setTattooSource(project.tattooSource as any);
      setTransform(project.transform);
      setActiveView("editor");
    }
  };

  const handleSave = async () => {
    if (!bodyPhotoUrl || !tattooUrl) {
      toast.error("Please upload both a body photo and select a tattoo");
      return;
    }

    setIsSaving(true);

    const input: CreateTryOnProjectInput = {
      name: projectName,
      bodyPhotoId,
      bodyPhotoUrl,
      tattooImageUrl: tattooUrl,
      tattooSource,
      transform,
    };

    const result = await createTryOnProject(input);
    
    if (result.success) {
      toast.success("Project saved successfully!");
      loadProjects();
    } else {
      toast.error(result.error?.message || "Failed to save project");
    }

    setIsSaving(false);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);

    try {
      const imageData = canvasRef.current.exportImage();
      
      // Download locally
      const link = document.createElement("a");
      link.href = imageData;
      link.download = `tattoo-try-on-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Image exported successfully!");
    } catch (error) {
      toast.error("Failed to export image");
    }

    setIsExporting(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTryOnProject(id);
    if (result.success) {
      toast.success("Project deleted");
      loadProjects();
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleReset = () => {
    setTransform(defaultTransform);
  };

  const canEdit = bodyPhotoUrl && tattooUrl;

  return (
    <div className="min-h-screen bg-black pb-12">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-16 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveView(activeView === "editor" ? "projects" : "editor")}
              >
                {activeView === "editor" ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Camera className="h-6 w-6 text-brand-400" />
                  Tattoo Try-On
                </h1>
                <p className="text-sm text-white/60">
                  Preview tattoos on your body
                </p>
              </div>
            </div>

            {activeView === "editor" && canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4 mr-2" />
                  )}
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "projects" ? (
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Projects</h2>
              <Button onClick={() => setActiveView("editor")}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
            <ProjectList
              projects={projects}
              onSelect={(project) => {
                loadProject(project.id);
              }}
              onDelete={handleDelete}
            />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Panel - Inputs */}
            <div className="lg:col-span-3 space-y-6">
              <Card className="p-4 border-white/10 bg-white/5">
                <label className="text-sm font-medium text-white mb-3 block">
                  Project Name
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="bg-white/5 border-white/10"
                />
              </Card>

              <ImageUploader
                value={bodyPhotoUrl}
                onChange={(url, file) => {
                  setBodyPhotoUrl(url);
                  // TODO: Upload file and get ID
                  setBodyPhotoId("temp-id");
                }}
                label="Body Photo"
                description="Upload a photo of your body"
                aspectRatio="portrait"
              />

              <TattooSelector
                value={tattooUrl}
                onChange={(url, source) => {
                  setTattooUrl(url);
                  setTattooSource(source);
                }}
                generatedTattoos={[]}
              />
            </div>

            {/* Center - Canvas */}
            <div className="lg:col-span-6">
              {canEdit ? (
                <TransformCanvas
                  ref={canvasRef as any}
                  bodyImageUrl={bodyPhotoUrl}
                  tattooImageUrl={tattooUrl}
                  transform={transform}
                  onTransformChange={setTransform}
                  className="w-full aspect-[3/4] rounded-xl"
                />
              ) : (
                <Card className="aspect-[3/4] flex flex-col items-center justify-center border-white/10 bg-white/5 border-dashed">
                  <Camera className="h-16 w-16 text-white/20 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">
                    Ready to Preview
                  </h3>
                  <p className="text-white/60 text-center max-w-sm">
                    Upload a body photo and select a tattoo design to start
                  </p>
                </Card>
              )}
            </div>

            {/* Right Panel - Controls */}
            <div className="lg:col-span-3">
              {canEdit ? (
                <TransformControls
                  transform={transform}
                  onChange={setTransform}
                  onReset={handleReset}
                />
              ) : (
                <Card className="p-6 border-white/10 bg-white/5">
                  <div className="text-center">
                    <Sparkles className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-white mb-2">
                      Transform Controls
                    </h3>
                    <p className="text-sm text-white/60">
                      Controls will appear here once you upload images
                    </p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
