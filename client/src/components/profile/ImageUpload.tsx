import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import { ImageUp } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import Cookies from "js-cookie";

const uploadProfilePic = async ({
  file,
  type,
}: {
  file: File;
  type: string;
}) => {
  const formData = new FormData();
  formData.append("profilePic", file);

  const response = await api.post(
    `/api/v1/user/upload-profile-pic/${type}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const ImageUpload = ({ type }: { type: string }) => {
  const { showToast } = useToast();
  const { setUser } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: uploadProfilePic,
    onSuccess: (data) => {
      setUser(data.user);
      Cookies.set("user", JSON.stringify(data.user), { expires: 15 });
      console.log("Upload Successful");
      queryClient.invalidateQueries({ queryKey: ["userData"] });
      showToast(
        "success",
        type === "profilePic"
          ? "Profile Picture Updated Successfully"
          : "Cover Picture Updated Successfully",
        "bottom-right",
        2000
      );
      setIsOpen(false);
    },
    onError: (error) => {
      console.error("Upload Failed:", error);
      showToast("error", "Upload Failed", "bottom-right", 2000);
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const { mutate, isPending, isSuccess, isError } = mutation;

  const handleUpload = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      mutate({ file, type });
    }
  };

  if (type !== "profilePic" && type !== "coverPic") {
    return null;
  }

  return (
    <div>
      {/* Trigger to open dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <ImageUp className="h-4 w-4 text-gray-500" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {type === "profilePic"
                ? "Upload Profile Picture"
                : "Upload Cover Picture"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="flex flex-col gap-4">
            <label
              htmlFor="file-input"
              className="flex items-center justify-center px-4 py-2 bg-lime-500 text-white rounded-md cursor-pointer hover:bg-lime-700"
            >
              Choose File
            </label>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            )}
            <DialogFooter>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded ${
                  isPending ? "bg-gray-400" : "bg-lime-600 hover:bg-lime-700"
                }`}
                disabled={isPending}
              >
                {isPending ? "Uploading..." : "Upload"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </DialogFooter>
          </form>
          {isError && (
            <p className="text-sm text-red-600 mt-2">
              Upload failed. Please try again.
            </p>
          )}
          {isSuccess && (
            <p className="text-sm text-green-600 mt-2">Upload successful!</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageUpload;
