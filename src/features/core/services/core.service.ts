import { getDocById, setDocById } from "@/lib/firebase/firestore";
import { CoreIdentity } from "../types/core.types";

export const CoreService = {
  /**
   * Obtiene la identidad central (CORE) del usuario.
   */
  getCoreIdentity: (uid: string) => getDocById<CoreIdentity>("core", uid),
  
  /**
   * Actualiza los datos de telemetría y visibilidad del CORE.
   */
  updateCoreIdentity: (uid: string, data: Partial<CoreIdentity>) => 
    setDocById("core", uid, data)
};
