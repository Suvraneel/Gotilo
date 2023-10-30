import React, { useState } from "react";
import { BasicIcons } from "./BasicIcons";
import { useLocalPeer } from "@huddle01/react/hooks";
import { useEnsName, useEnsAvatar, useAccount } from "wagmi";

interface Props {
  displayName: string;
}

const NameEditor: React.FC<Props> = ({ displayName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDisplayName, setEditedDisplayName] = useState(displayName);

  const { address } = useAccount();

  const { data: ens } = useEnsName({
    address: address as `0x${string}`,
  });

  const { data: ensAvatar } = useEnsAvatar({
    name: ens,
  });

  const { updateMetadata } = useLocalPeer<{
    displayName: string;
    avatarUrl: string;
  }>();

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    updateMetadata({
      displayName: editedDisplayName,
      avatarUrl: ensAvatar ?? "/4.png",
    });
    setIsEditing(false);
  };

  const handleInputChange = (e: { target: { value: any } }) => {
    const newName = e.target.value;
    if (!newName.includes(".")) {
      setEditedDisplayName(newName);
    }
  };

  return (
    <div className="flex w-full flex-shrink text-slate-100 absolute bottom-1 left-1 rounded-md py-1 px-2 font-lg gap-2 justify-start items-center">
      {isEditing ? (
        <div className="flex w-fit justify-start items-center">
          <input
            title="displayName"
            className="flex bg-transparent w-28 text-white outline-dashed outline-1 outline-white truncate px-1 rounded-sm"
            type="text"
            value={editedDisplayName}
            onChange={handleInputChange}
            disabled={!isEditing}
          />
          <div onClick={handleSaveClick}>{BasicIcons.save}</div>
          {BasicIcons.ping}
        </div>
      ) : (
        <div className="w-full truncate flex justify-start  items-center gap-2">
          <span className="w-28">{`${editedDisplayName ?? "Gotilo"} (You)` ?? "Gotilo (You)"}</span>
          <div className="flex justify-start items-center">
            <div onClick={handleEditClick}>{BasicIcons.pencil}</div>
            <div className="w-6 h-6">{BasicIcons.ping}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NameEditor;
