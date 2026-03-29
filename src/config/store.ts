import Conf from "conf";
import path from "path";
import os from "os";

export interface SGTConfig {
  provider?: string;
  model?: Record<string, string>;
  keys?: Record<string, string[]>;
  customModels?: Record<string, string[]>;
  showWelcome?: boolean;
}

const store = new Conf<SGTConfig>({
  projectName: "sgt-cli",
  configName: "config",
  cwd: path.join(os.homedir(), ".config", "sgt-cli"),
});

export default store;
