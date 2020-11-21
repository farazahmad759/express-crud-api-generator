import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";
var fs = require("fs");

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--git": Boolean,
      "--yes": Boolean,
      "--install": Boolean,
      "-g": "--git",
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    git: args["--git"] || false,
    template: args._[0],
    runInstall: args["--install"] || false,
    // rawArgs: rawArgs.slice(2),
  };
}

async function promptForMissingOptions(options) {
  const defaultTemplate = "JavaScript";
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    };
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Please choose which project template to use",
      choices: ["javascript", "typescript"],
      default: defaultTemplate,
    });
  }

  if (!options.git) {
    questions.push({
      type: "confirm",
      name: "git",
      message: "Initialize a git repository?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  };
}
export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMissingOptions(options);
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  // #1 read all schema files from targetDirectory/db/schemas and return json objects
  let jsonSchemas = [];
  let schemaDirectory = options.targetDirectory + "/db/schemas";
  fs.readdirSync(schemaDirectory).forEach((file) => {
    var obj = JSON.parse(fs.readFileSync(schemaDirectory + "/" + file, "utf8"));
    jsonSchemas.push(obj);
  });
  // #2 create migration files

  // #3 create model files

  // #4 create controllers

  console.log(jsonSchemas);
}
