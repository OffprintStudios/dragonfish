// Heavily inspired by napi-rs's "napi" script, (https://github.com/napi-rs/napi-rs/blob/master/scripts/napi.js) 
// but capable of handling Cargo.toml files with workspaces.

/* Usage:
     copyNativeLibs [--release] [output path]
    
     If --release is specified, looks in the '/target/release/' directory of the Rust crate
     instead of '/target/debug'.

     If 'output path' is specified, produced native modules will be copied to it.
*/

import * as parseArgs from 'minimist';
import * as path from 'path';
import * as fs from 'fs';
import * as toml from 'toml';
import * as os from 'os';

function isDarwin(platform: NodeJS.Platform): platform is NodeJS.Platform {
    return platform === "darwin";
}

function isLinux(platform: NodeJS.Platform): platform is NodeJS.Platform {
    return platform == "linux";
}

function isWindows(platform: NodeJS.Platform): platform is NodeJS.Platform {
    return platform === "win32";
}

function getTomlContent(filepath: string) : any {
    let rawTomlString : string;
    let tomlContent: any;

    try {
        rawTomlString = fs.readFileSync(filepath, "utf-8");
    } catch {
        throw new TypeError("Unable to find a Cargo.toml in the current working directory.");
    }

    try {
        tomlContent = toml.parse(rawTomlString);
    } catch {
        throw new TypeError("Unable to parse Cargo.toml.");
    }

    return tomlContent;
}

function copyLibraryToDotNode(tomlContent: any) {
    if (!(tomlContent?.package?.name)) {
        throw new TypeError("No package.name field in Cargo.toml.");
    }

    const moduleName = tomlContent.package.name.replace(/-/g, '_');
    const argv = parseArgs(process.argv.slice(2), {
        boolean: ['release'],
    });
    const userPlatform = os.platform();
    let libExtension;
    let libName = moduleName;

    if (isDarwin(userPlatform)) {
        libExtension = ".dylib";
        libName = `lib${moduleName}`;
    } else if (isLinux(userPlatform)) {
        libExtension = ".so";
        libName = `lib${moduleName}`;
    } else if (isWindows(userPlatform)) {
        libExtension = ".dll";        
    } else {
        console.error("Operating system unrecognized, or unsupported by this build script.");
        process.exit(1);
    }    

    let distModulePath;
    if (argv._[0]) {
        // Check to see if user-input destination both a) exists and b) is a folder
        if (fs.existsSync(argv._[0]) && fs.lstatSync(argv._[0]).isDirectory()) {
            distModulePath = `${argv._[0]}${moduleName}.node`;        
        } else {
            throw new TypeError(`The output folder '${argv._[0]}' does not exist, or is not a directory.`);
        }
    } else {
        distModulePath = path.join(process.cwd(), "native", "compiled", `${moduleName}.node`);
    }
    const parsedDist = path.parse(distModulePath);

    // Set output path to just <cwd>/moduleName
    if (!parsedDist.name || parsedDist.name === ".") {
        distModulePath = moduleName;
    }
    
    // Tack on the .node extension if it hasn't been added yet
    if (!parsedDist.ext) {
        distModulePath = `${distModulePath}.node`;
    }

    const nodeModulesPos = __dirname.indexOf("node_modules");    
    const rustTargetDir = argv.release ? "release" : "debug";    
    const libContent = fs.readFileSync(
        path.join(
            __dirname.substring(0, nodeModulesPos),
            "target",
            rustTargetDir,
            `${libName}${libExtension}`,
        ),
    );
    console.log(`Native module ${moduleName} copied to ${distModulePath}`);
    fs.writeFileSync(distModulePath, libContent);
}

let tomlContent = getTomlContent(path.join(process.cwd(), "Cargo.toml"));
if (tomlContent.workspace) {    
    tomlContent.workspace.members.forEach(function (workspacePath: string) {
        tomlContent = getTomlContent(path.join(process.cwd(), workspacePath, "Cargo.toml"));
        copyLibraryToDotNode(tomlContent);
    });
} else {
    copyLibraryToDotNode(tomlContent);
}