import React, { useEffect, useRef } from "react";
import { Track } from "@/lib/types";
import Image from "next/image";
import { OPEN_SPOTIFY } from "@/lib/constants";

interface TrackModalProps {
  track: Track;
  onClose: () => void;
}

const TrackModal: React.FC<TrackModalProps> = ({ track, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      {/* <button
        className="close-button"
        onClick={onClose}
        aria-label="Close"
      ></button> */}
      {track && (
        <div
          className="modal-content"
          ref={modalRef}
          onClick={() => {
            window.open(track.externalUrl || OPEN_SPOTIFY, "_blank");
          }}
        >
          {track?.imageUrl && (
            <Image
              src={track.imageUrl}
              alt={track.name}
              width={400}
              height={400}
            />
          )}
          <div className="track-metadata-container">
            <h2 className="text-md">{track.name}</h2>
            <p className="text-sm">{track.artists}</p>
            <p className="text-sm">{track.album}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackModal;
