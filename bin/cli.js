#!/usr/bin/env node

import { Command } from 'commander';
import { confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', 'templates');

async function personalize(destDir, projectName) {
  const filesToPersonalize = ['package.json', 'index.html'];

  for (const file of filesToPersonalize) {
    const filePath = path.join(destDir, file);
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const updated = content.replaceAll('{{PROJECT_NAME}}', projectName);
      await fs.writeFile(filePath, updated);
    } catch {
      // file non presente in questo template (es. index.html se un giorno aggiungi varianti senza), si ignora
    }
  }
}

async function addSupabase(destDir) {
  await fs.cp(path.join(templatesDir, 'supabase'), destDir, { recursive: true });

  const pkgPath = path.join(destDir, 'package.json');
  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
  pkg.dependencies = {
    ...pkg.dependencies,
    '@supabase/supabase-js': '^2.45.0',
  };
  await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2));
}

async function addDocker(destDir) {
  await fs.cp(path.join(templatesDir, 'docker'), destDir, { recursive: true });
}

async function addGithubActions(destDir) {
  const workflowsDir = path.join(destDir, '.github', 'workflows');
  await fs.mkdir(workflowsDir, { recursive: true });
  await fs.copyFile(
    path.join(templatesDir, 'github-actions', 'deploy.yml'),
    path.join(workflowsDir, 'deploy.yml')
  );
}

const program = new Command();

program
  .name('create-my-stack')
  .description("CLI scaffolding tool for Vite + Tailwind v4 + Supabase + Docker projects")
  .version('1.0.0')
  .argument('<project-name>', "name of the directory/project to create")
  .action(async (projectName) => {
    const destDir = path.join(process.cwd(), projectName);
    try {
      await fs.access(destDir);
      console.log(chalk.red(`✖ La cartella "${projectName}" esiste già.`));
      process.exit(1);
    } catch {
      // ok :)
    }

    console.log(chalk.blue(`\nCreazione progetto: ${projectName}\n`));

    const useSupabase = await confirm({ message: 'Includere Supabase?' });
    const useDocker = await confirm({ message: 'Includere Docker?' });
    const useActions = await confirm({ message: 'Includere GitHub Actions per il deploy?' });

    console.log(chalk.dim('\nGenerazione file in corso...\n'));

    await fs.cp(path.join(templatesDir, 'base'), destDir, { recursive: true });
    await personalize(destDir, projectName);

    if (useSupabase) {
      await addSupabase(destDir);
    }
    if (useDocker) {
      await addDocker(destDir);
    }
    if (useActions) {
      await addGithubActions(destDir);
    }

    console.log(chalk.green(`✔ Progetto "${projectName}" creato con successo!`));
    console.log(chalk.dim(`\nOpzioni scelte: Supabase=${useSupabase}, Docker=${useDocker}, GitHub Actions=${useActions}`));
  });

program.parse();
