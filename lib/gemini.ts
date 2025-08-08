
// lib/gemini.ts

import { GoogleGenerativeAI, type Content } from '@google/generative-ai';
// Import the admin client for uploading to storage
import { supabaseAdmin } from '@/lib/supabase/admin';

export type ChatHistory = Content[];

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
const textModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Enhanced regex patterns for comprehensive image request detection
const IMAGE_ACTION_WORDS = /(generate|create|draw|make|produce|design|build|craft|render|paint|sketch|illustrate|visualize|show me|give me)/i;
const IMAGE_NOUNS = /(image|picture|photo|illustration|drawing|artwork|graphic|visual|design|painting|sketch|diagram|chart|infographic|poster|banner|logo|icon|wallpaper|background)/i;
const IMAGE_DESCRIPTORS = /(of|with|showing|depicting|featuring|containing|representing|about)/i;

// Multi-pattern image detection with context awareness
const IMAGE_REQUEST_PATTERNS = [
  // Direct requests: "generate an image", "create a picture"
  new RegExp(`${IMAGE_ACTION_WORDS.source}\\s+(?:an?\\s+|some\\s+|a\\s+few\\s+)?${IMAGE_NOUNS.source}`, 'i'),
  
  // Contextual requests: "I want an image of", "Can you show me a picture"
  /(?:i\s+(?:want|need|would\s+like)|can\s+you|could\s+you|please)\s+.*?(?:image|picture|photo|illustration|drawing|artwork|visual)/i,
  
  // Visual description requests: "what would X look like", "visualize this"
  /(?:what\s+(?:would|does)|how\s+(?:would|does)|visualize|envision).*?(?:look\s+like|appear|seem)/i,
  
  // Art/design requests: "design a logo", "paint something"
  /(?:design|paint|sketch|draw|illustrate|render)(?:\s+(?:me|us))?\s+(?:a|an|some)/i,
  
  // Show me requests: "show me what X looks like"
  /show\s+me\s+(?:what|how|a|an).*?(?:looks?\s+like|appears?|seems?)/i
];

// Context keywords that suggest visual content
const VISUAL_CONTEXT_KEYWORDS = [
  'color', 'style', 'appearance', 'visual', 'artistic', 'aesthetic',
  'portrait', 'landscape', 'scene', 'character', 'object', 'abstract',
  'realistic', 'cartoon', 'anime', '3d', '2d', 'digital art'
];

// Enhanced image detection function with chain of thought
function detectImageRequest(prompt: string): {
  isImageRequest: boolean;
  confidence: number;
  reasoning: string;
  matchedPatterns: string[];
} {
  const reasoning: string[] = [];
  const matchedPatterns: string[] = [];
  let confidence = 0;
  
  console.log('🔍 Analyzing prompt for image generation intent:', prompt);
  
  // Step 1: Check direct pattern matches
  for (let i = 0; i < IMAGE_REQUEST_PATTERNS.length; i++) {
    const pattern = IMAGE_REQUEST_PATTERNS[i];
    if (pattern.test(prompt)) {
      confidence += 30;
      matchedPatterns.push(`Pattern ${i + 1}`);
      reasoning.push(`✅ Matched direct image request pattern ${i + 1}`);
    }
  }
  
  // Step 2: Check for action + noun combinations
  const hasActionWord = IMAGE_ACTION_WORDS.test(prompt);
  const hasImageNoun = IMAGE_NOUNS.test(prompt);
  
  if (hasActionWord && hasImageNoun) {
    confidence += 25;
    reasoning.push('✅ Contains both action word and image noun');
  } else if (hasActionWord) {
    confidence += 10;
    reasoning.push('⚠️ Contains action word but no clear image noun');
  } else if (hasImageNoun) {
    confidence += 15;
    reasoning.push('⚠️ Contains image noun but no clear action word');
  }
  
  // Step 3: Check for visual context keywords
  const visualKeywords = VISUAL_CONTEXT_KEYWORDS.filter(keyword => 
    prompt.toLowerCase().includes(keyword.toLowerCase())
  );
  
  if (visualKeywords.length > 0) {
    confidence += visualKeywords.length * 5;
    reasoning.push(`✅ Found visual context keywords: ${visualKeywords.join(', ')}`);
  }
  
  // Step 4: Check for negative indicators (text-only requests)
  const textOnlyIndicators = [
    /(?:explain|describe|tell\s+me|what\s+is|how\s+to|write|list)/i,
    /(?:definition|meaning|concept|idea|theory)/i,
    /(?:code|program|script|function|algorithm)/i
  ];
  
  for (const indicator of textOnlyIndicators) {
    if (indicator.test(prompt) && confidence < 40) {
      confidence -= 15;
      reasoning.push('⚠️ Contains text-only request indicators');
    }
  }
  
  // Step 5: Final decision logic
  const isImageRequest = confidence >= 25;
  const finalReasoning = [
    `📊 Confidence score: ${confidence}/100`,
    `🎯 Decision: ${isImageRequest ? 'IMAGE GENERATION' : 'TEXT RESPONSE'}`,
    ...reasoning
  ].join('\n');
  
  console.log('🧠 Chain of thought analysis:\n', finalReasoning);
  
  return {
    isImageRequest,
    confidence,
    reasoning: finalReasoning,
    matchedPatterns
  };
}

// Enhanced prompt extraction with better context preservation
function extractImagePrompt(originalPrompt: string): string {
  let extractedPrompt = originalPrompt;
  
  // Remove common request phrases while preserving descriptive content
  const removalPatterns = [
    /(?:please\s+)?(?:can\s+you\s+)?(?:could\s+you\s+)?(?:i\s+(?:want|need|would\s+like)\s+(?:you\s+to\s+)?)/i,
    /(?:generate|create|draw|make|produce|design|build|craft|render|paint|sketch|illustrate|visualize|show\s+me|give\s+me)/i,
    /(?:an?\s+|some\s+|a\s+few\s+)?(?:image|picture|photo|illustration|drawing|artwork|graphic|visual|design|painting|sketch)\s*/i,
    /(?:of|with|showing|depicting|featuring|containing|representing|about)?\s*/i
  ];
  
  for (const pattern of removalPatterns) {
    extractedPrompt = extractedPrompt.replace(pattern, '').trim();
  }
  
  // If the extraction resulted in an empty or very short prompt, use a portion of the original
  if (extractedPrompt.length < 10) {
    // Take the latter half of the original prompt, assuming it contains the description
    const words = originalPrompt.split(' ');
    extractedPrompt = words.slice(Math.floor(words.length / 2)).join(' ');
  }
  
  console.log('🎨 Extracted prompt for image generation:', extractedPrompt);
  return extractedPrompt;
}

interface ApiResponse {
  type: 'text' | 'image';
  content: string;
}

export async function getApiResponse(
  prompt: string,
  history: ChatHistory
): Promise<ApiResponse> {
  // Enhanced image detection with detailed analysis
  const analysis = detectImageRequest(prompt);
  
  console.log('📋 Analysis Summary:');
  console.log('- Is Image Request:', analysis.isImageRequest);
  console.log('- Confidence:', analysis.confidence);
  console.log('- Matched Patterns:', analysis.matchedPatterns);

  // If the prompt is for an image, call the Stability AI API
  if (analysis.isImageRequest) {
    try {
      const promptText = extractImagePrompt(prompt);

      console.log('🚀 Proceeding with image generation using prompt:', promptText);

      const response = await fetch('https://subnp.com/api/free/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptText,
          model: 'flux', // 'turbo', 'magic' are also supported
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SubNP API error:', response.status, errorText);
        throw new Error(`SubNP API error: ${response.statusText}`);
      }

      const reader = response.body
        ?.pipeThrough(new TextDecoderStream())
        .pipeThrough(new TransformStream({
          transform(chunk, controller) {
            const lines = chunk.split('\n');
            lines
              .filter(line => line.startsWith('data: '))
              .map(line => JSON.parse(line.slice(6)))
              .forEach(data => {
                if (data.status === 'complete' && data.imageUrl) {
                  controller.enqueue(data.imageUrl);
                } else if (data.status === 'error') {
                  controller.error(new Error(data.message));
                }
              });
          }
        }))
        .getReader();

      if (!reader) throw new Error('Failed to initialize SSE reader');

      let imageUrl: string | null = null;
      while (true) {
        const { done, value } = await reader.read();
        if (done || imageUrl) break;
        imageUrl = value;
      }

      if (!imageUrl) throw new Error('Image URL not returned from SubNP.');

      const imgResp = await fetch(imageUrl);
      const arrayBuffer = await imgResp.arrayBuffer();
      const imageBuffer = Buffer.from(arrayBuffer);
      const fileName = `img_${Date.now()}.png`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from('generated-images')
        .upload(fileName, imageBuffer, { contentType: 'image/png' });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError);
        throw new Error(`Supabase upload error: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from('generated-images')
        .getPublicUrl(fileName);

      return { type: 'image', content: publicUrl };

    } catch (error) {
      console.error('Error during image generation with SubNP:', error);
      return {
        type: 'text',
        content: "Sorry, I couldn't generate the image right now. Please try again.'"
      };
    }
  } else {
    // Enhanced text response with better context awareness
    try {
      console.log('💬 Proceeding with text-based response using Gemini');
      
      // Create an enhanced prompt that provides better context to Gemini
      const enhancedPrompt = history.length === 0 
        ? `Please provide a comprehensive and helpful response to: ${prompt}`
        : prompt;
      
      const chat = textModel.startChat({ history });
      const result = await chat.sendMessage(enhancedPrompt);
      const text = result.response.text();
      
      console.log('✅ Generated text response successfully');
      return { type: 'text', content: text };
    } catch (error) {
      console.error('Error with Gemini Text Model (Chat):', error);
      return { 
        type: 'text', 
        content: 'Sorry, I am unable to respond right now. Please try again later or rephrase your question.' 
      };
    }
  }
}