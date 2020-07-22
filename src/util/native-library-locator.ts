import * as path from 'path';

let cachedPath : string | undefined = undefined;

/**
 * Searches the LD_LIBRARY_PATH environment variable to find the location of our compiled native modules.
 * Returns null if it can't find anything.
 */
export function getNativeLibPath() : string | null {
    if (cachedPath) {
        return cachedPath;
    }

    const loadLibraryPaths = process.env.LD_LIBRARY_PATH;
    const allPaths = loadLibraryPaths.split(":");
    const viablePaths = allPaths.filter(x => path.basename(x) === "pulpfiction");
    if (viablePaths.length === 0) {
        return null;
    }

    cachedPath = viablePaths[0];
    return cachedPath;
}