// Test script generator
import { scriptGenerator } from './backend/src/marketing/scriptGenerator.js';

console.log('🎬 VIRAL SCRIPT GENERATOR TEST\n');

// Test 1: DidYouKnow template (animations topic)
console.log('=== Template: DidYouKnow (Animations) ===');
const script1 = scriptGenerator.generate({
  template: 'DidYouKnow',
  topic: 'animations',
  tone: 'excited',
  targetAudience: 'all'
});

console.log('Hook:', script1.hook);
console.log('Problem:', script1.problem);
console.log('Solution:', script1.solution);
console.log('CTA:', script1.cta);
console.log('Duration:', script1.estimatedDuration, 'seconds');
console.log('Full voiceover:', script1.voiceoverText);
console.log('\nProps for Remotion:');
console.log(JSON.stringify(script1.props, null, 2));

console.log('\n=== Template: DidYouKnow (Performance) ===');
const script2 = scriptGenerator.generate({
  template: 'DidYouKnow',
  topic: 'performance',
  tone: 'urgent'
});

console.log('Hook:', script2.hook);
console.log('Problem:', script2.problem);
console.log('Solution:', script2.solution);
console.log('CTA:', script2.cta);

console.log('\n=== Template: DidYouKnow (Productivity) ===');
const script3 = scriptGenerator.generate({
  template: 'DidYouKnow',
  topic: 'productivity',
  tone: 'professional'
});

console.log('Hook:', script3.hook);
console.log('Problem:', script3.problem);
console.log('Solution:', script3.solution);
console.log('CTA:', script3.cta);

console.log('\n✅ Script generator working! Ready to create viral content 🚀');
