"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Modal, ModalBody, Button } from "@/lib/flowbite-compat";
import { X, Crop, Check, ZoomIn, ZoomOut } from "lucide-react";
import CustomModalHeader from "./CustomModalHeader";
interface ImageCropperModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedFile: File) => void;
  onSkip?: () => void;
  aspectRatio?: number;
  cropShape?: "rect" | "round";
}
const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: any,
): Promise<File> => {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (error) => reject(error));
    img.src = imageSrc;
  });
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("No 2d context");
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
    pixelCrop.height,
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (file) => {
        if (file) {
          resolve(
            new File([file], "cropped_image.jpeg", { type: "image/jpeg" }),
          );
        } else {
          reject(new Error("Canvas is empty"));
        }
      },
      "image/jpeg",
      0.7,
    );
  });
};
const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  onSkip,
  aspectRatio = 1,
  cropShape = "rect",
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const handleCropComplete = useCallback(
    (croppedArea: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );
  const handleSave = async () => {
    try {
      setIsCropping(true);
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };
  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="3xl"
      theme={{
        root: {
          base: "fixed inset-0 z-50 h-modal h-screen overflow-visible flex items-center justify-center",
          show: {
            on: "flex bg-gray-900/60 dark:bg-gray-900/90 backdrop-blur-sm",
            off: "hidden",
          },
        },
        content: {
          base: "relative h-auto w-full p-4",
          inner:
            "relative flex max-h-[90dvh] flex-col rounded-xl bg-white shadow-2xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden",
        },
      }}
    >
      {" "}
      <div className="flex items-center justify-between p-5 border-b bg-white/50 dark:bg-gray-800/50 backdrop-blur-md">
        {" "}
        <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
          {" "}
          <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            {" "}
            <Crop size={20} />{" "}
          </span>{" "}
          Adjust Image Framing{" "}
        </h3>{" "}
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-gray-500 bg-transparent rounded-md hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors shadow-sm"
        >
          {" "}
          <X size={16} />{" "}
        </button>{" "}
      </div>{" "}
      <ModalBody className="p-6 bg-gray-50/50 dark:bg-gray-900/50">
        {" "}
        <div className="relative w-full h-[55vh] min-h-[350px] rounded-xl overflow-hidden shadow-inner bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-200 dark:bg-gray-800">
          {" "}
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={handleCropComplete}
            onZoomChange={setZoom}
            cropShape={cropShape}
            classes={{
              containerClassName: "rounded-xl",
              mediaClassName: "object-contain",
            }}
            showGrid={true}
          />{" "}
        </div>{" "}
      </ModalBody>{" "}
      <div className="p-5 bg-white dark:bg-gray-800">
        {" "}
        <div className="max-w-md mx-auto mb-6">
          {" "}
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-900/50 px-4 py-2.5 rounded-full shadow-sm">
            {" "}
            <ZoomOut size={18} className="text-indigo-400" />{" "}
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.05}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600 hover:accent-indigo-500 transition-all"
            />{" "}
            <ZoomIn size={18} className="text-indigo-400" />{" "}
          </div>{" "}
        </div>{" "}
        <div className="flex justify-between items-center w-full">
          {" "}
          <div>
            {" "}
            {onSkip && (
              <button
                type="button"
                onClick={() => {
                  onSkip();
                  onClose();
                }}
                disabled={isCropping}
                className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                {" "}
                Skip Cropping{" "}
              </button>
            )}{" "}
          </div>{" "}
          <div className="flex justify-end gap-3">
            {" "}
            <button
              type="button"
              onClick={onClose}
              disabled={isCropping}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-all shadow-sm hover:shadow active:scale-95"
            >
              {" "}
              Cancel{" "}
            </button>{" "}
            <button
              type="button"
              onClick={handleSave}
              disabled={isCropping || !croppedAreaPixels}
              className="px-6 py-2.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {" "}
              {isCropping ? (
                <>
                  {" "}
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>{" "}
                  Processing...{" "}
                </>
              ) : (
                <>
                  {" "}
                  <Check size={16} /> Crop & Save{" "}
                </>
              )}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </Modal>
  );
};
export default ImageCropperModal;
