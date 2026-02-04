#!/usr/bin/env ts-node
/**
 * Script to add subtitle support to all Remotion templates
 * 
 * Usage: npx ts-node scripts/add-subtitles-to-templates.ts
 */

import fs from "fs/promises";
import path from "path";

const TEMPLATES_DIR = path.join(__dirname, "../remotion/src/templates");

const SUBTITLE_IMPORTS = `import { Subtitles, SubtitleChunk, generateSubtitleChunks } from "../components/Subtitles";`;

const SUBTITLE_PROPS = `  script?: string;
  subtitlesEnabled?: boolean;
  subtitleChunks?: SubtitleChunk[];`;

const SUBTITLE_LOGIC = `  // Generate subtitle chunks if script is provided but chunks aren't
  const chunks = React.useMemo(() => {
    if (subtitleChunks) return subtitleChunks;
    if (script) {
      return generateSubtitleChunks(script, fps, durationInFrames, 3);
    }
    return [];
  }, [script, subtitleChunks, fps, durationInFrames]);`;

const SUBTITLE_RENDER = `
      {/* Subtitles Overlay */}
      {subtitlesEnabled && chunks.length > 0 && (
        <Subtitles
          chunks={chunks}
          style={{
            fontFamily: "Poppins, Montserrat, Arial Black, sans-serif",
            fontSize: 52,
            primaryColor: "#FFFFFF",
            highlightColor: "#FFD700",
            strokeColor: "#000000",
            strokeWidth: 4,
            position: "bottom",
            bottomOffset: 140,
            shadow: true,
            shadowBlur: 20,
            shadowColor: "rgba(0,0,0,0.8)",
          }}
        />
      )}`;

async function addSubtitlesToTemplate(templatePath: string) {
  const templateName = path.basename(templatePath);
  console.log(`\n📝 Processing: ${templateName}`);

  let content = await fs.readFile(templatePath, "utf-8");
  let modified = false;

  // 1. Add imports if not present
  if (!content.includes("Subtitles") && !content.includes("SubtitleChunk")) {
    // Find the last import and add after it
    const lastImportMatch = content.match(/import\s+.*from\s+["'].*["'];/g);
    if (lastImportMatch) {
      const lastImport = lastImportMatch[lastImportMatch.length - 1];
      content = content.replace(lastImport, `${lastImport}\n${SUBTITLE_IMPORTS}`);
      console.log("  ✅ Added subtitle imports");
      modified = true;
    }
  }

  // 2. Add props to interface
  if (!content.includes("subtitlesEnabled")) {
    // Find Props interface
    const propsInterfaceMatch = content.match(/interface Props \{[\s\S]*?\n\}/);
    if (propsInterfaceMatch) {
      const propsInterface = propsInterfaceMatch[0];
      const lastLine = propsInterface.split("\n").slice(-1)[0];
      const newPropsInterface = propsInterface.replace(
        lastLine,
        `${SUBTITLE_PROPS}\n${lastLine}`
      );
      content = content.replace(propsInterface, newPropsInterface);
      console.log("  ✅ Added subtitle props to interface");
      modified = true;
    }
  }

  // 3. Add subtitle destructuring to component
  if (!content.includes("subtitlesEnabled")) {
    // Find component declaration with props destructuring
    const componentMatch = content.match(/export const \w+: React\.FC<Props> = \(\{[\s\S]*?\}\) => \{/);
    if (componentMatch) {
      const componentDecl = componentMatch[0];
      // Add to destructuring
      const newComponentDecl = componentDecl.replace(
        /\}\) => \{/,
        `,\n  script,\n  subtitlesEnabled = true,\n  subtitleChunks\n}) => {`
      );
      content = content.replace(componentDecl, newComponentDecl);
      console.log("  ✅ Added subtitle destructuring");
      modified = true;
    }
  }

  // 4. Add useVideoConfig if not present (needed for fps/durationInFrames)
  if (!content.includes("durationInFrames")) {
    const useConfigMatch = content.match(/const \{ fps \} = useVideoConfig\(\);/);
    if (useConfigMatch) {
      content = content.replace(
        useConfigMatch[0],
        "const { fps, durationInFrames } = useVideoConfig();"
      );
      console.log("  ✅ Updated useVideoConfig to include durationInFrames");
      modified = true;
    }
  }

  // 5. Add subtitle generation logic
  if (!content.includes("Generate subtitle chunks")) {
    // Add after useVideoConfig
    const useConfigMatch = content.match(/const \{ fps, durationInFrames \} = useVideoConfig\(\);/);
    if (useConfigMatch) {
      content = content.replace(
        useConfigMatch[0],
        `${useConfigMatch[0]}\n\n${SUBTITLE_LOGIC}`
      );
      console.log("  ✅ Added subtitle generation logic");
      modified = true;
    }
  }

  // 6. Add subtitle render (before closing AbsoluteFill)
  if (!content.includes("Subtitles Overlay")) {
    // Find the last closing tag before </AbsoluteFill>
    const lastClosingMatch = content.match(/<\/AbsoluteFill>/);
    if (lastClosingMatch) {
      content = content.replace(
        "</AbsoluteFill>",
        `${SUBTITLE_RENDER}\n    </AbsoluteFill>`
      );
      console.log("  ✅ Added subtitle render component");
      modified = true;
    }
  }

  if (modified) {
    // Create backup
    await fs.copyFile(templatePath, `${templatePath}.backup`);
    console.log("  💾 Created backup");

    // Write updated content
    await fs.writeFile(templatePath, content, "utf-8");
    console.log("  ✨ Template updated successfully!");
  } else {
    console.log("  ⏭️  Skipped (already has subtitles)");
  }
}

async function main() {
  console.log("🎬 Adding subtitle support to all templates...\n");

  try {
    const files = await fs.readdir(TEMPLATES_DIR);
    const templateFiles = files.filter(
      (f) => f.endsWith(".tsx") && !f.includes("WithSubtitles") && !f.includes(".backup")
    );

    console.log(`Found ${templateFiles.length} templates to process\n`);

    for (const file of templateFiles) {
      const templatePath = path.join(TEMPLATES_DIR, file);
      await addSubtitlesToTemplate(templatePath);
    }

    console.log("\n✅ All templates processed!");
    console.log("\n📋 Next steps:");
    console.log("1. Review changes (backups created with .backup extension)");
    console.log("2. Test each template in Remotion Studio");
    console.log("3. Commit changes to git");
    console.log("4. Delete backup files once confirmed");
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main();
