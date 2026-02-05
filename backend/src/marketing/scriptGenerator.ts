/**
 * AI Script Generator for Viral Instagram Reels
 * Generates hooks, problems, solutions, and CTAs optimized for engagement
 */

export interface ScriptRequest {
  template: 'DidYouKnow' | 'StopUsing' | 'POV' | 'ThreeReasons' | 'BeforeAfter' | 'ThisChanged' | 'WatchThis';
  topic?: 'animations' | 'performance' | 'dx' | 'design' | 'productivity' | 'general';
  tone?: 'excited' | 'calm' | 'urgent' | 'professional';
  targetAudience?: 'beginners' | 'senior-devs' | 'designers' | 'all';
}

export interface Script {
  hook: string;              // First 3 seconds
  problem: string;           // Seconds 3-8
  solution: string;          // Seconds 8-13
  cta: string;              // Last 2 seconds
  estimatedDuration: number; // Total seconds
  voiceoverText: string;    // Full combined text
  subtitleChunks: string[]; // Pre-split for timing
  props: Record<string, any>; // Template-specific props
}

// Viral hook patterns
const HOOKS = {
  DidYouKnow: [
    "Did you know 80% of devs waste {time} on {task}?",
    "Did you know this mistake costs {number} hours?",
    "Ever wondered why {problem}?",
    "This will change how you {action} forever",
    "I was shocked when I discovered this",
  ],
  StopUsing: [
    "Stop using {old_method} for {task}",
    "Stop wasting time on {bad_practice}",
    "Everyone's wrong about {topic}",
    "Please stop doing this in {year}",
  ],
  POV: [
    "POV: You just discovered {solution} at 2AM",
    "POV: You realize you've been doing it wrong",
    "When you find the perfect {tool}",
    "That feeling when {positive_outcome}",
  ],
  ThreeReasons: [
    "3 reasons devs love {product}",
    "3 things I wish I knew about {topic}",
    "Top 3 mistakes with {task}",
  ],
};

// Pain points to amplify
const PROBLEMS = {
  animations: [
    "Most developers spend 10+ hours/week fighting with CSS animations",
    "Complex animations slow down your site and frustrate users",
    "Writing animations from scratch is time-consuming and error-prone",
  ],
  performance: [
    "Bloated component libraries kill your bundle size",
    "Every extra KB costs you users and conversions",
    "Slow load times = lost revenue",
  ],
  dx: [
    "Re-inventing the wheel on every project wastes countless hours",
    "Copy-pasting Stack Overflow code leads to bugs",
    "Building UI from scratch delays shipping features",
  ],
  design: [
    "Making components look professional takes design skills most devs don't have",
    "Design handoffs are slow and often lead to misunderstandings",
    "Consistency across your app is hard to maintain",
  ],
  productivity: [
    "Context switching between design tools and code kills productivity",
    "Every project starts with the same boring boilerplate",
    "Small UI tweaks turn into multi-hour rabbit holes",
  ],
};

// Solutions (benefit-focused)
const SOLUTIONS = {
  animations: [
    "Kinetik UI gives you 100+ professional animations copy-paste ready",
    "Every animation is optimized for 60fps performance",
    "Just drop in a component and it works beautifully",
  ],
  performance: [
    "Kinetik UI is 80% smaller than other animation libraries",
    "Tree-shaking means you only ship what you use",
    "Optimized bundle size = faster load times",
  ],
  dx: [
    "Kinetik UI components work out of the box",
    "No configuration needed - just import and use",
    "TypeScript support for a better developer experience",
  ],
  design: [
    "Every component is designed by professionals",
    "Consistent design system built in",
    "Looks polished without design skills",
  ],
  productivity: [
    "Save 10+ hours per week on UI development",
    "Ship features faster with ready-made components",
    "Focus on your app logic, not UI details",
  ],
};

// Call-to-actions
const CTAS = [
  "Link in bio 👆",
  "Try it free now",
  "Get started today",
  "Join 10,000+ developers",
  "Don't miss out",
  "Save hours this week",
  "Download free",
];

// Stats for impact
const STATS = {
  time_saved: ["10 hours/week", "3 hours/day", "40 hours/month"],
  adoption: ["10,000+ devs", "50,000+ projects", "1M+ downloads"],
  performance: ["80% smaller", "3x faster", "60fps animations"],
  components: ["100+ components", "200+ animations", "50+ templates"],
};

export class ScriptGenerator {
  /**
   * Generate a viral script based on template and parameters
   */
  generate(req: ScriptRequest): Script {
    const topic = req.topic || 'general';
    const template = req.template;

    // Select random hook
    const hookTemplate = this.randomChoice(HOOKS[template] || HOOKS.DidYouKnow);
    const hook = this.fillTemplate(hookTemplate, {
      time: this.randomChoice(STATS.time_saved),
      task: "repetitive UI work",
      problem: "your animations are janky",
      action: "build UI",
      solution: "Kinetik UI",
      tool: "component library",
      positive_outcome: "you find the perfect solution",
      product: "Kinetik UI",
      number: "10+",
      old_method: "vanilla CSS",
      bad_practice: "reinventing components",
      year: new Date().getFullYear().toString(),
    });

    // Select problem
    const problemList = PROBLEMS[topic] || PROBLEMS.dx;
    const problem = this.randomChoice(problemList);

    // Select solution
    const solutionList = SOLUTIONS[topic] || SOLUTIONS.dx;
    const solution = this.randomChoice(solutionList);

    // Select CTA
    const cta = this.randomChoice(CTAS);

    // Combine into voiceover text
    const voiceoverText = `${hook} ${problem} ${solution} ${cta}`;

    // Split into subtitle chunks (natural pauses)
    const subtitleChunks = this.splitIntoChunks(voiceoverText);

    // Calculate duration (average 3 words per second)
    const wordCount = voiceoverText.split(' ').length;
    const estimatedDuration = Math.ceil(wordCount / 3) + 2; // +2 for pauses

    // Template-specific props
    const props: Record<string, any> = {
      hook,
      problem,
      solution,
      cta,
    };

    // Add stat for DidYouKnow template
    if (template === 'DidYouKnow') {
      props.stat = this.randomChoice(["80%", "90%", "70%", "60%", "10x"]);
    }

    return {
      hook,
      problem,
      solution,
      cta,
      estimatedDuration,
      voiceoverText,
      subtitleChunks,
      props,
    };
  }

  /**
   * Generate multiple variants for A/B testing
   */
  generateVariants(base: ScriptRequest, count: number): Script[] {
    const variants: Script[] = [];
    for (let i = 0; i < count; i++) {
      variants.push(this.generate(base));
    }
    return variants;
  }

  /**
   * Get all available templates
   */
  getTemplates(): string[] {
    return ['DidYouKnow', 'StopUsing', 'POV', 'ThreeReasons', 'BeforeAfter', 'ThisChanged', 'WatchThis'];
  }

  // Helper methods
  private randomChoice<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private fillTemplate(template: string, vars: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(`{${key}}`, value);
    }
    return result;
  }

  private splitIntoChunks(text: string): string[] {
    // Split on sentence endings and conjunctions for natural pauses
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    
    for (const sentence of sentences) {
      // Further split long sentences on commas and "and"
      const parts = sentence.split(/(?<=,|\band\b)\s+/);
      chunks.push(...parts);
    }
    
    return chunks.filter(chunk => chunk.trim().length > 0);
  }
}

// Export singleton instance
export const scriptGenerator = new ScriptGenerator();
