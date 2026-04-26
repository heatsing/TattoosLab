"use client";

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Save,
  Download,
  Loader2,
  Plus,
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "@/components/tryon/image-uploader";
import { TattooSelector } from "@/components/tryon/tattoo-selector";
import {
  TransformCanvas,
  TransformCanvasHandle,
} from "@/components/tryon/transform-canvas";
import { TransformControls } from "@/components/tryon/transform-controls";
import { ProjectList } from "@/components/tryon/project-list";
import {
  TransformState,
  CreateTryOnProjectInput,
} from "@/lib/validations/tryon";
import {
  createTryOnProject,
  updateTryOnProject,
  deleteTryOnProject,
  getTryOnProjects,
  getTryOnProject,
  getGeneratedTattooOptions,
  GeneratedTattooOption,
  TryOnProjectSummary,
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
  return (
    <Suspense fallback={<TryOnPageFallback />}>
      <TryOnPageContent />
    </Suspense>
  );
}

function TryOnPageContent() {
  const searchParams = useSearchParams();
  const projectIdFromUrl = searchParams.get("id");
  const canvasRef = useRef<TransformCanvasHandle>(null);

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [projectName, setProjectName] = useState("New Try-On Project");
  const [bodyPhotoUrl, setBodyPhotoUrl] = useState("");
  const [bodyPhotoId, setBodyPhotoId] = useState("");
  const [tattooUrl, setTattooUrl] = useState("");
  const [tattooSource, setTattooSource] = useState<
    "GENERATED" | "UPLOADED" | "GALLERY" | "PRESET"
  >("GENERATED");
  const [transform, setTransform] = useState<TransformState>(defaultTransform);
  const [activeView, setActiveView] = useState<"editor" | "projects">("editor");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [projects, setProjects] = useState<TryOnProjectSummary[]>([]);
  const [generatedTattoos, setGeneratedTattoos] = useState<
    GeneratedTattooOption[]
  >([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    void Promise.all([loadProjects(), loadGeneratedTattoos()]);
  }, []);

  useEffect(() => {
    if (projectIdFromUrl) {
      void loadProject(projectIdFromUrl);
    }
  }, [projectIdFromUrl]);

  const loadProjects = async () => {
    setIsLoadingProjects(true);
    const result = await getTryOnProjects();
    if (result.success && result.data) {
      setProjects(result.data);
    }
    setIsLoadingProjects(false);
  };

  const loadGeneratedTattoos = async () => {
    const result = await getGeneratedTattooOptions();
    if (result.success && result.data) {
      setGeneratedTattoos(result.data);
    }
  };

  const loadProject = async (id: string) => {
    const result = await getTryOnProject(id);
    if (result.success && result.data) {
      const project = result.data;
      setCurrentProjectId(project.id);
      setProjectName(project.name || "Untitled Project");
      setBodyPhotoUrl(project.bodyPhotoUrl);
      setBodyPhotoId(project.bodyPhotoId);
      setTattooUrl(project.tattooImageUrl);
      setTattooSource(project.tattooSource);
      setTransform(project.transform);
      setActiveView("editor");
    }
  };

  const uploadAsset = useCallback(
    async (file: File, type: "BODY_PHOTO" | "REFERENCE") => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      return data as { uploadId: string; url: string };
    },
    []
  );

  const handleBodyPhotoUpload = useCallback(
    async (file: File) => {
      const uploaded = await uploadAsset(file, "BODY_PHOTO");
      setBodyPhotoId(uploaded.uploadId);
      return uploaded.url;
    },
    [uploadAsset]
  );

  const handleTattooUpload = useCallback(
    async (file: File) => {
      const uploaded = await uploadAsset(file, "REFERENCE");
      return uploaded.url;
    },
    [uploadAsset]
  );

  const handleReferenceImageSelection = () => {
    if (!generatedTattoos.length) {
      toast.info("Generate a tattoo first, then come back to try it on.");
    }
  };

  const persistProject = async (): Promise<string | null> => {
    if (!bodyPhotoUrl || !bodyPhotoId || !tattooUrl) {
      toast.error("Please upload a body photo and select a tattoo");
      return null;
    }

    if (currentProjectId) {
      const result = await updateTryOnProject({
        id: currentProjectId,
        name: projectName,
        transform,
      });

      if (!result.success) {
        toast.error(result.error?.message || "Failed to update project");
        return null;
      }

      return currentProjectId;
    }

    const input: CreateTryOnProjectInput = {
      name: projectName,
      bodyPhotoId,
      bodyPhotoUrl,
      tattooImageUrl: tattooUrl,
      tattooSource,
      transform,
    };

    const result = await createTryOnProject(input);
    if (!result.success || !result.data) {
      toast.error(result.error?.message || "Failed to save project");
      return null;
    }

    setCurrentProjectId(result.data.id);
    return result.data.id;
  };

  const handleSave = async () => {
    setIsSaving(true);
    const savedId = await persistProject();

    if (savedId) {
      toast.success("Project saved successfully!");
      await loadProjects();
    }

    setIsSaving(false);
  };

  const handleExport = async () => {
    if (!canvasRef.current) return;

    setIsExporting(true);

    try {
      const savedProjectId = await persistProject();
      if (!savedProjectId) {
        setIsExporting(false);
        return;
      }

      const imageData = canvasRef.current.exportImage();
      const response = await fetch("/api/tryon/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: savedProjectId,
          imageData,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to export image");
      }

      const link = document.createElement("a");
      link.href = data.url || imageData;
      link.download = `tattoo-try-on-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await loadProjects();
      toast.success("Image exported successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to export image");
    }

    setIsExporting(false);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteTryOnProject(id);
    if (result.success) {
      if (currentProjectId === id) {
        resetEditor();
      }
      toast.success("Project deleted");
      await loadProjects();
    } else {
      toast.error("Failed to delete project");
    }
  };

  const handleReset = () => {
    setTransform(defaultTransform);
  };

  const resetEditor = () => {
    setCurrentProjectId(null);
    setProjectName("New Try-On Project");
    setBodyPhotoUrl("");
    setBodyPhotoId("");
    setTattooUrl("");
    setTattooSource("GENERATED");
    setTransform(defaultTransform);
    setActiveView("editor");
  };

  const canEdit = Boolean(bodyPhotoUrl && tattooUrl);

  return (
    <div className="min-h-screen bg-black pb-12">
      <div className="sticky top-16 z-30 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  setActiveView(activeView === "editor" ? "projects" : "editor")
                }
              >
                {activeView === "editor" ? (
                  <ChevronLeft className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
              </Button>
              <div>
                <h1 className="flex items-center gap-2 text-2xl font-bold text-white">
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
                <Button variant="outline" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save
                </Button>
                <Button onClick={handleExport} disabled={isExporting}>
                  {isExporting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeView === "projects" ? (
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Your Projects</h2>
              <Button onClick={resetEditor}>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
            <ProjectList
              projects={projects}
              onSelect={(project) => {
                void loadProject(project.id);
              }}
              onDelete={handleDelete}
              selectedId={currentProjectId || undefined}
              isLoading={isLoadingProjects}
            />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-3">
              <Card className="border-white/10 bg-white/5 p-4">
                <label className="mb-3 block text-sm font-medium text-white">
                  Project Name
                </label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                  className="border-white/10 bg-white/5"
                />
              </Card>

              <ImageUploader
                value={bodyPhotoUrl}
                onChange={(url) => {
                  setBodyPhotoUrl(url);
                  if (!url) {
                    setBodyPhotoId("");
                  }
                }}
                onUpload={handleBodyPhotoUpload}
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
                onUpload={handleTattooUpload}
                generatedTattoos={generatedTattoos}
                onEmptyGeneratedClick={handleReferenceImageSelection}
              />
            </div>

            <div className="lg:col-span-6">
              {canEdit ? (
                <TransformCanvas
                  ref={canvasRef}
                  bodyImageUrl={bodyPhotoUrl}
                  tattooImageUrl={tattooUrl}
                  transform={transform}
                  onTransformChange={setTransform}
                  className="aspect-[3/4] w-full rounded-xl"
                />
              ) : (
                <Card className="flex aspect-[3/4] flex-col items-center justify-center border-dashed border-white/10 bg-white/5">
                  <Camera className="mb-4 h-16 w-16 text-white/20" />
                  <h3 className="mb-2 text-lg font-medium text-white">
                    Ready to Preview
                  </h3>
                  <p className="max-w-sm text-center text-white/60">
                    Upload a body photo and select a tattoo design to start
                  </p>
                </Card>
              )}
            </div>

            <div className="lg:col-span-3">
              {canEdit ? (
                <TransformControls
                  transform={transform}
                  onChange={setTransform}
                  onReset={handleReset}
                />
              ) : (
                <Card className="border-white/10 bg-white/5 p-6">
                  <div className="text-center">
                    <Sparkles className="mx-auto mb-4 h-12 w-12 text-white/20" />
                    <h3 className="mb-2 text-lg font-medium text-white">
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

function TryOnPageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
    </div>
  );
}
