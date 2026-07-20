import { getDocById, setDocById } from "@/lib/firebase/firestore";
import { UserProfile } from "@/types/index";

export const CoreService = {
  /**
   * Obtiene la identidad central (CORE) del usuario.
   */
  getCoreIdentity: (uid: string) => getDocById<UserProfile>("core", uid),
  
  /**
   * Actualiza los datos de telemetría y visibilidad del CORE.
   */
  updateCoreIdentity: (uid: string, data: Partial<UserProfile["core"]>) => 
    setDocById("core", uid, data)
};
