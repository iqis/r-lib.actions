import * as core from "@actions/core";
import { getR } from "./installer";
import * as path from "path";
import * as fs from "fs";

let tempDirectory = process.env["RUNNER_TEMP"] || "";
console.log("#######")
console.log(tempDirectory)
console.log(fs.readdirSync(tempDirectory))
console.log("#######")

async function run() {
  try {
    core.debug(`started action`);
   
    var version: string
    version = core.getInput("r-version")

    if (version === "renv") {
      core.debug(`temp dir is ${tempDirectory}`)
      let renv_lock_path = path.join(tempDirectory, "renv.lock");
      if (fs.existsSync(renv_lock_path)) {
        let renv_lock = fs.readFileSync(renv_lock_path).toString();
        version = JSON.parse(renv_lock).R.Version;
        core.debug(`got version ${version} from renv.lock`);
      } else {
        core.setFailed("./renv.lock does not exist.");
      }
    } else {
      version = version
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
