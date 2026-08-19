import { useEffect, useState } from "react";
import api, { authHeaders } from "../api/axios";

/**
 * Fetches the current user (with their role + permissions) once per
 * mount and exposes a hasPermission() check, so components can hide
 * admin-only nav links / show a friendly message instead of letting the
 * user click into something the API will 403 on anyway. The backend's
 * CheckPermission middleware remains the real enforcement point; this
 * is purely for a better UI experience.
 */
export default function usePermissions() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    api
      .get("/user", { headers: authHeaders() })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching current user:", err);
        setLoading(false);
      });
  }, []);

  const permissionSlugs = user?.role?.permissions?.map((p) => p.slug) || [];

  const hasPermission = (slug) => permissionSlugs.includes(slug);

  return { user, loading, hasPermission, permissionSlugs };
}
