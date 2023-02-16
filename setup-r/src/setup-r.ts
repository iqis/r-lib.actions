import * as core from "@actions/core";
import { getR } from "./installer";
import * as path from "path";

async function run() {
  try {
    core.debug(`started action`);
   
    var version: string
    if (core.getInput("r-version") === "renv") {
      let renv_lock_path = "./renv.lock";
      if (fs.existsSync(renv_lock_path)) {
        let renv_lock = fs.readFileSync(renv_lock_path);
        version = JSON.parse(renv_lock).R.Version;
        core.debug(`got version ${version} from renv.lock`);
      } else {
        core.setFailed("./renv.lock does not exist.");
      }
    } else {
      version = core.getInput("r-version")
      core.debug(`got version ${version} from input`);
    }

    await getR(version);

    const matchersPath = path.join(__dirname, "..", ".github");
    console.log(`##[add-matcher]${path.join(matchersPath, "rcmdcheck.json")}`);
    console.log(`##[add-matcher]${path.join(matchersPath, "testthat.json")}`);
    console.log(`##[add-matcher]${path.join(matchersPath, "r.json")}`);
  } catch (error) {
    core.setFailed(`${error}`);
  }
}

run();
