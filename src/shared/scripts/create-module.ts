import fs from 'fs';
import path from 'path';

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('❌ Please provide module name');
  process.exit(1);
}

const basePath = path.join(process.cwd(), 'src/modules', moduleName);

const folders = ['application/service', 'domain', 'infrastructure', 'interfaces', 'validation'];

try {
  fs.mkdirSync(basePath, { recursive: true });

  folders.forEach((folder) => {
    fs.mkdirSync(path.join(basePath, folder), { recursive: true });
  });

  // service
  fs.writeFileSync(
    path.join(basePath, 'application/service', `${moduleName}.service.ts`),
    `export const ${moduleName}Service = {

};`,
  );

  // schema
  fs.writeFileSync(
    path.join(basePath, 'domain', `${moduleName}.schema.ts`),
    `export const ${moduleName}Schema = {

};`,
  );

  // constants
  fs.writeFileSync(
    path.join(basePath, 'domain', `${moduleName}.constants.ts`),
    `export const ${moduleName.toUpperCase()}_MESSAGES = {

};`,
  );

  // repository
  fs.writeFileSync(
    path.join(basePath, 'infrastructure', `${moduleName}.repository.ts`),
    `export const ${moduleName}Repository = {

};`,
  );

  // controller
  fs.writeFileSync(
    path.join(basePath, 'interfaces', `${moduleName}.controller.ts`),
    `export const ${moduleName}Controller = {

};`,
  );

  // routes
  fs.writeFileSync(
    path.join(basePath, 'interfaces', `${moduleName}.routes.ts`),
    `import { Router } from "express";

const router = Router();

export const ${moduleName}Routes = router;
`,
  );

  // validation
  fs.writeFileSync(
    path.join(basePath, 'validation', `${moduleName}.validation.ts`),
    `export const ${moduleName}Validation = {

};`,
  );

  console.info(`✅ Module '${moduleName}' created successfully`);
} catch (error) {
  console.error({ err: error }, '❌ Error creating module:');
}
