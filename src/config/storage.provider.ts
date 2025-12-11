import GCPStorage from "../storage/gcp.storage";
import LocalDiskStorage from "../storage/local.storage";
import OnPremStorage from "../storage/onpre.storage"; 
import { StorageService } from "../storage/storage.service"; 

let storage: StorageService;

switch (process.env.STORAGE_PROVIDER) {
  case "gcp":
    storage = new GCPStorage();
    break;
  case "onprem":
    storage = new OnPremStorage();
    break;
  case "local":
  default:
    storage = new LocalDiskStorage();
}

export default storage;
