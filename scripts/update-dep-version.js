// Usage: node scripts/update-dep-version.js <package-json-path> <dependency-name>
const fs = require('fs');
const path = require('path');

const [, , pkgName, depName] = process.argv;

if (!pkgName || !depName) {
	console.error('Usage: node scripts/update-dep-version.js <package-json-path> <dependency-name>');
	process.exit(1);
}

// Assume all packages are under 'packages/'
const depPkgJsonPath = path.join('packages', depName, 'package.json');
const pkgNameJsonPath = path.join('packages', pkgName, 'package.json');
let latestVersion;

try {
	const depPkg = JSON.parse(fs.readFileSync(depPkgJsonPath, 'utf8'));
	latestVersion = depPkg.version;
} catch (err) {
	console.error(`Failed to read version for ${depName}:`, err.message);
	process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgNameJsonPath, 'utf8'));
let updated = false;
if (pkg.dependencies && pkg.dependencies[depName]) {
	pkg.dependencies[depName] = `^${latestVersion}`;
	// Bump patch version
    const [major, minor, patch] = pkg.version.split('.').map(Number);
    pkg.version = [major, minor, patch + 1].join('.');
	updated = true;
}

if (!updated) {
	console.error(`Dependency ${depName} not found in ${pkgName}`);
	process.exit(1);
}

fs.writeFileSync(pkgNameJsonPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`Updated ${depName} to ^${latestVersion} in ${pkgName}`);