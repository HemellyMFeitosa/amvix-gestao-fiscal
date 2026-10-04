import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Trash2, ZoomIn, ZoomOut } from "lucide-react";
import { toast } from "sonner";
import Cropper from "react-easy-crop";
import { Slider } from "@/components/ui/slider";

interface UploadFotoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (fotoBase64: string) => void;
  fotoAtual: string | null;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: Area): Promise<string> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Não foi possível criar contexto do canvas");
  }

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL("image/jpeg", 0.9);
};

export const UploadFotoDialog = ({
  open,
  onOpenChange,
  onSave,
  fotoAtual,
}: UploadFotoDialogProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Formato inválido. Use JPG, PNG ou WEBP.");
      return;
    }

    // Validar tamanho (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Arquivo muito grande. Máximo 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImageSrc(reader.result as string);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    });
    reader.readAsDataURL(file);
  };

  const handleSalvar = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsLoading(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage);
      toast.success("Foto atualizada com sucesso!");
      handleClose();
    } catch (error) {
      toast.error("Erro ao processar imagem");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoverFoto = () => {
    onSave("");
    toast.success("Foto removida com sucesso!");
    handleClose();
  };

  const handleClose = () => {
    setImageSrc(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Foto de Perfil
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!imageSrc ? (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">
                    Clique para selecionar uma foto
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG ou WEBP • Máximo 2MB
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Recomendado: 500x500px
                  </p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Área de Crop */}
              <div className="relative h-80 bg-black/50 rounded-lg overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              {/* Controles de Zoom */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Zoom</span>
                  <span className="font-medium">{Math.round(zoom * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <ZoomOut className="h-4 w-4 text-muted-foreground" />
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={1}
                    max={3}
                    step={0.1}
                    className="flex-1"
                  />
                  <ZoomIn className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Botão para trocar imagem */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                Escolher Outra Imagem
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex-row justify-between sm:justify-between">
          <div>
            {fotoAtual && (
              <Button
                variant="destructive"
                onClick={handleRemoverFoto}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Foto
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button
              onClick={handleSalvar}
              disabled={!imageSrc || isLoading}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
