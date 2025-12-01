import React, { useState, useRef, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const UserActionsDropdown = ({
  user,
  onMakeAdmin,
  onRemoveAdmin,
  onGrantFreeSub,
  onSuspend,
  onActivate,
  onDelete,
  onViewChats,
  onViewLogs,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // închide meniul dacă dai click în afară
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        iconName="MoreVertical"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-card border border-border shadow-lg rounded-lg z-50">
          {/* Admin actions */}
          {!user.roles.includes("admin") ? (
            <button
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                onMakeAdmin(user.id);
              }}
            >
              <Icon name="Shield" size={16} /> Promovează la admin
            </button>
          ) : (
            <button
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                onRemoveAdmin(user.id);
              }}
            >
              <Icon name="UserMinus" size={16} /> Revocă drepturile admin
            </button>
          )}

          {/* Free subscription */}
          <button
            className="dropdown-item"
            onClick={() => {
              setOpen(false);
              onGrantFreeSub(user.id);
            }}
          >
            <Icon name="Gift" size={16} /> Abonament gratuit
          </button>

          {/* Suspend / activate */}
          {!user.is_active ? (
            <button
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                onActivate(user.id);
              }}
            >
              <Icon name="CheckCircle2" size={16} /> Activează cont
            </button>
          ) : (
            <button
              className="dropdown-item"
              onClick={() => {
                setOpen(false);
                onSuspend(user.id);
              }}
            >
              <Icon name="Ban" size={16} /> Suspendă cont
            </button>
          )}

          {/* View chats */}
          <button
            className="dropdown-item"
            onClick={() => {
              setOpen(false);
              onViewChats(user.id);
            }}
          >
            <Icon name="MessageSquare" size={16} /> Convorbiri AI
          </button>

          {/* Activity logs */}
          <button
            className="dropdown-item"
            onClick={() => {
              setOpen(false);
              onViewLogs(user.id);
            }}
          >
            <Icon name="Activity" size={16} /> Activitate
          </button>

          {/* Delete */}
          <button
            className="dropdown-item text-red-600 hover:bg-red-600 hover:text-white"
            onClick={() => {
              setOpen(false);
              onDelete(user.id);
            }}
          >
            <Icon name="Trash2" size={16} /> Șterge contul
          </button>
        </div>
      )}
    </div>
  );
};

export default UserActionsDropdown;
