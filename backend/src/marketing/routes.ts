import { Router } from 'express';
import { scriptGenerator, ScriptRequest } from './scriptGenerator.js';

const router = Router();

/**
 * POST /api/marketing/script/generate
 * Generate a new viral script
 */
router.post('/script/generate', async (req, res) => {
  try {
    const request: ScriptRequest = req.body;

    // Validate template
    const validTemplates = scriptGenerator.getTemplates();
    if (!request.template || !validTemplates.includes(request.template)) {
      return res.status(400).json({
        error: 'Invalid template',
        validTemplates,
      });
    }

    const script = scriptGenerator.generate(request);

    res.json({
      success: true,
      script,
    });
  } catch (error: any) {
    console.error('Script generation error:', error);
    res.status(500).json({
      error: 'Failed to generate script',
      message: error.message,
    });
  }
});

/**
 * POST /api/marketing/script/variants
 * Generate multiple variants for A/B testing
 */
router.post('/script/variants', async (req, res) => {
  try {
    const { request, count = 3 } = req.body;

    if (!request || !request.template) {
      return res.status(400).json({
        error: 'Request with template is required',
      });
    }

    if (count < 1 || count > 10) {
      return res.status(400).json({
        error: 'Count must be between 1 and 10',
      });
    }

    const variants = scriptGenerator.generateVariants(request, count);

    res.json({
      success: true,
      count: variants.length,
      variants,
    });
  } catch (error: any) {
    console.error('Variant generation error:', error);
    res.status(500).json({
      error: 'Failed to generate variants',
      message: error.message,
    });
  }
});

/**
 * GET /api/marketing/script/templates
 * List available templates
 */
router.get('/script/templates', (req, res) => {
  const templates = scriptGenerator.getTemplates();
  
  res.json({
    success: true,
    templates: templates.map(template => ({
      id: template,
      name: template.replace(/([A-Z])/g, ' $1').trim(),
      duration: '10-25 seconds',
    })),
  });
});

/**
 * POST /api/marketing/video/create
 * Create a viral video with generated script
 */
router.post('/video/create', async (req, res) => {
  try {
    const { template, topic, tone, targetAudience } = req.body;

    // Generate script
    const script = scriptGenerator.generate({
      template,
      topic,
      tone,
      targetAudience,
    });

    // Return script + rendering info (actual rendering would be handled by existing video queue)
    res.json({
      success: true,
      script,
      renderConfig: {
        compositionId: template,
        props: script.props,
        estimatedRenderTime: '30-60 seconds',
      },
      nextSteps: 'Use POST /api/videos with the compositionId and props to render',
    });
  } catch (error: any) {
    console.error('Video creation error:', error);
    res.status(500).json({
      error: 'Failed to create video',
      message: error.message,
    });
  }
});

export default router;
